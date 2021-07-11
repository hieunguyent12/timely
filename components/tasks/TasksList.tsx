import { Box, Text, Button, UnorderedList, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React, { useState, useEffect, useCallback } from "react";
import update from "immutability-helper";
import { useDrop } from "react-dnd";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import { TaskType, FolderType, SubtaskType } from "../../types/api";
import TaskItem from "./TaskItem";

interface Props {
  _tasks: TaskType[] | null | undefined;
  _subtasks: {
    tasks: SubtaskType[];
    parentTaskId: string;
    parentTaskDue: string;
  } | null;
  folder: FolderType | null;
}

export default function TasksList({ folder, _tasks, _subtasks }: Props) {
  const [tasks, setTasks] = useState(_tasks);
  const [subtasks, setSubtasks] = useState(_subtasks);
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  let parentTaskDue = _subtasks?.parentTaskDue;
  let date;
  if (parentTaskDue) {
    if (parentTaskDue === "none") {
      date = new Date();
    } else {
      date = new Date(parentTaskDue);
    }
  } else {
    date = new Date();
  }

  const [dueDate, setDueDate] = useState<Date | null>(date);

  const [, drop] = useDrop(
    () => ({
      accept: "TASK_ITEM",

      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        handlerId: monitor.getHandlerId(),
      }),
      // drop: () => {
      //   // const foldersOrder = localStorage.getItem("foldersOrder");
      //   localStorage.setItem("foldersOrder", JSON.stringify(folders));
      // },
    }),
    [tasks]
  );

  useEffect(() => {
    async function callback(e: KeyboardEvent) {
      if (tasks) {
        if (e.code === "Enter" && isAdding && taskName !== "") {
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folderId: folder?._id,
              folderName: folder?.name,
              name: taskName,
            }),
          });

          const data = await response.json();
          if (response.ok && !data.error) {
            if (tasks) {
              setTasks([...tasks, data]);
            } else {
              setTasks([data]);
            }
            setIsAdding(!isAdding);
            setTaskName("");
          }
        }
      }

      if (subtasks) {
        if (e.code === "Enter" && isAdding && taskName !== "") {
          const response = await fetch("/api/subtasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId: subtasks.parentTaskId,
              subtask: {
                name: taskName,
                status: "active",
              },
            }),
          });

          const data = await response.json();
          if (response.ok && !data.error) {
            if (tasks) {
              setSubtasks({
                ...subtasks,
                tasks: [...subtasks.tasks, data],
              });
            } else {
              setSubtasks({
                ...subtasks,
                tasks: [data],
              });
            }
            setIsAdding(!isAdding);
            setTaskName("");
          }
        }
      }
    }
    window.addEventListener("keydown", callback);

    return () => window.removeEventListener("keydown", callback);
  }, [isAdding, folder, taskName, tasks, subtasks]);

  useEffect(() => {
    let worker: any;

    if (tasks && _tasks) {
      worker = new Worker("/worker.js");
      worker.postMessage(tasks);

      worker.onmessage = (e: any) => {
        console.log(e);
      };
    }

    // if (!("Notification" in window)) {
    //   alert("This browser does not support desktop notification");
    // }
    // // Let's check whether notification permissions have already been granted
    // else if (Notification.permission === "granted") {
    //   console.log("notification granted");
    //   // If it's okay let's create a notification
    //   var notification = new Notification("Hi there!");
    // }
    // // Otherwise, we need to ask the user for permission
    // else if (Notification.permission !== "denied") {
    //   console.log("notification denied");
    //   Notification.requestPermission().then(function (permission) {
    //     console.log("notification accepted");
    //     // If the user accepts, let's create a notification
    //     if (permission === "granted") {
    //       var notification = new Notification("Hi there!");
    //     }
    //   });
    // }
    return () => worker && worker.terminate();
  }, [tasks, _tasks]);

  const toggleIsAdding = async () => {
    setIsAdding(!isAdding);
  };

  const onCheckboxClick = async (task: TaskType | null) => {
    if (task && tasks) {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: task._id,
          status: task.status === "active" ? "done" : "active",
          operation: "STATUS",
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        const newTasks: TaskType[] | undefined = tasks?.map((item) => {
          if (item._id === data._id) {
            return data;
          } else {
            return item;
          }
        });

        setTasks(newTasks);
      }
    }
  };

  const onDeleteTask = async (task: TaskType | null) => {
    if (task && tasks) {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: task._id,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        const newTasks = tasks?.filter((item) => item._id !== task._id);
        setTasks(newTasks);
      }
    }
  };

  const onSetReminder = async () => {
    if (subtasks && _subtasks) {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: subtasks.parentTaskId,
          operation: "REMINDER",
          due: dueDate,
        }),
      });
    }
  };

  const onSelectTask = (task: TaskType | null) => {
    if (task && tasks) {
      if (task?._id === selectedTask?._id) {
        setSelectedTask(null);
      } else {
        setSelectedTask(task);
      }
    }
  };

  const findTask = useCallback(
    (id: string): { task: TaskType; index: number } | null => {
      if (tasks) {
        const task: TaskType = tasks.filter((task) => task._id === id)[0];
        return {
          task,
          index: tasks.indexOf(task),
        };
      }

      return null;
    },
    [tasks]
  );

  const moveTask = useCallback(
    (id: string, atIndex: number) => {
      const data = findTask(id);

      if (data && tasks) {
        const { task, index } = data;

        setTasks(
          update(tasks, {
            $splice: [
              [index, 1],
              [atIndex, 0, task],
            ],
          })
        );
      }
    },
    [tasks, setTasks, findTask]
  );

  const renderList = () => {
    if (tasks) {
      return tasks.map((task, index) => (
        <TaskItem
          task={task}
          onCheckboxClick={onCheckboxClick}
          key={task._id}
          index={index}
          moveTask={moveTask}
          onDeleteTask={onDeleteTask}
          subtask={null}
          onSelectTask={onSelectTask}
          selectedTask={selectedTask}
        />
      ));
    }

    if (subtasks) {
      return subtasks.tasks.map((subtask, index) => (
        <TaskItem
          task={null}
          onCheckboxClick={onCheckboxClick}
          key={subtask._id}
          index={index}
          moveTask={moveTask}
          onDeleteTask={onDeleteTask}
          subtask={subtask}
          selectedTask={null}
        />
      ));
    }

    return null;
  };

  return (
    <>
      {tasks && (
        <Box
          d="flex"
          justifyContent="space-between"
          w="500px"
          mx="auto"
          maxW="100%"
        >
          <Text fontSize="20px">{folder && folder.name}</Text>
          <Button
            size="sm"
            colorScheme="twitter"
            leftIcon={<AddIcon />}
            onClick={toggleIsAdding}
          >
            new
          </Button>
        </Box>
      )}

      <UnorderedList
        mt={tasks ? "2" : undefined}
        ml={tasks ? "0" : undefined}
        listStyleType="none"
        ref={drop}
      >
        <>
          {subtasks && (
            <Box d="flex" alignItems="center" mb="1" mt="1">
              <Button size="sm" mr="2" onClick={onSetReminder}>
                Set reminder
              </Button>
              <DatePicker
                selected={dueDate}
                customInput={<Input type="text" size="sm" w="105px" />}
                // @ts-ignore
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                timeIntervals={5}
              />
              <Input type="text" size="sm" w="80px" ml="2" />
            </Box>
          )}

          {renderList()}
        </>

        {isAdding && (
          <Box textAlign="right">
            <Input
              placeholder="enter your task"
              size="sm"
              onChange={(e) => setTaskName(e.target.value)}
              ref={(node) => node?.focus()}
            />
            <Button onClick={() => setIsAdding(!isAdding)} mt="2" size="sm">
              cancel
            </Button>
          </Box>
        )}
      </UnorderedList>
    </>
  );
}
