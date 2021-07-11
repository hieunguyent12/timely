import {
  Box,
  Text,
  Checkbox,
  IconButton,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useDrag, useDrop } from "react-dnd";
import { useEffect, useState } from "react";

import { TaskType, SubtaskType } from "../../types/api";
import TaskList from "./TasksList";

interface Props {
  task: TaskType | null;
  index: number;
  subtask: SubtaskType | null;
  onCheckboxClick: (task: TaskType | null) => void;
  onDeleteTask: (task: TaskType | null) => void;
  moveTask: (id: string, index: number) => void;
  onSelectTask?: (task: TaskType | null) => void;
  selectedTask: TaskType | null;
}

interface DragItem {
  id: string;
  index: number;
  name: string;
}

export default function TaskItem({
  task,
  onCheckboxClick,
  onDeleteTask,
  index,
  moveTask,
  subtask,
  onSelectTask,
  selectedTask,
}: Props) {
  const [, drag] = useDrag(
    () => ({
      type: "TASK_ITEM",
      item: { id: task?._id, index, name: task?.name },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor) => {
        const { id: droppedId, index } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop && index && droppedId && task) {
          moveTask(droppedId, index);
        }
      },
    }),
    [task?._id, index, moveTask]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "TASK_ITEM",
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      canDrop: () => false,
      hover(item: DragItem) {
        if (item.id !== task?._id && task) {
          moveTask(item.id, index);
        }
      },
    }),
    [moveTask]
  );

  const onAddSubtask = async () => {
    const response = await fetch("/api/subtasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: task?._id,
        subtask: {
          id: "1",
          name: "test",
          status: "active",
        },
      }),
    });

    const data = await response.json();

    if (response.ok && !data.error) {
      console.log(data);
    }
  };

  const renderSubtasks: () => JSX.Element | null = () => {
    if (task?.subtasks) {
      return (
        <TaskList
          folder={null}
          _tasks={null}
          _subtasks={{
            parentTaskId: task._id,
            parentTaskDue: task.reminder,
            tasks: task.subtasks,
          }}
        />
      );
    }

    return null;
  };

  // useEffect(() => {
  //   if (task) {

  //   }
  // }, [task])

  return (
    <ListItem
      ref={(node) => {
        if (task) {
          drag(drop(node));
        }
      }}
    >
      <Box
        w="105%"
        h="40px"
        transition="0.2s"
        position="relative"
        right="10px"
        _hover={{
          bgColor: "gray.50",
          cursor: "pointer",
        }}
        rounded="md"
        pl="3"
        py="2"
        d="flex"
        alignItems="center"
        role="group"
        onClick={() => {
          if (task && onSelectTask) onSelectTask(task);
        }}
      >
        <input
          type="checkbox"
          onChange={() => onCheckboxClick(task)}
          checked={task?.status === "done"}
        />
        <Text ml="2" flex="1">
          {task ? task.name : subtask ? subtask.name : null}
        </Text>
        {task && (
          <IconButton
            icon={<AddIcon size="sm" />}
            aria-label="add subtask"
            size="sm"
            rounded="md"
            mr="2"
            d="none"
            // p="1"
            transition="0.2s"
            my="0"
            _groupHover={{
              display: "inline-block",
            }}
            onClick={onAddSubtask}
            // onClick={() => onDeleteTask(task)}
          />
        )}
        <IconButton
          icon={<DeleteIcon color="red.500" size="sm" />}
          aria-label="delete button"
          size="sm"
          rounded="md"
          mr="2"
          d="none"
          // p="1"
          transition="0.2s"
          my="0"
          _groupHover={{
            display: "inline-block",
          }}
          onClick={() => onDeleteTask(task)}
        />
      </Box>
      {selectedTask?._id === task?._id && renderSubtasks()}
    </ListItem>
  );

  // return (
  //   <Box d="flex" w="560px" mx="auto" ref={dropRef} data-handler-id={handlerId}>
  //     <Box
  //       d="flex"
  //       alignItems="center"
  //       position="relative"
  //       role="group"
  //       w="100%"
  //       ref={preview}
  //     >
  //       <Box
  //         d="none"
  //         opacity="0.3"
  //         position="absolute"
  //         ref={dragRef}
  //         aria-label="drag handle"
  //         _hover={{
  //           cursor: "pointer",
  //         }}
  //         _groupHover={{
  //           display: "block",
  //         }}
  //         background="none"
  //         outline="none"
  //       >
  //         <DragHandleIcon />
  //       </Box>

  //       <Box
  //         w="100%"
  //         transition="0.2s"
  //         position="relative"
  //         left="20px"
  //         _hover={{
  //           bgColor: "gray.50",
  //           cursor: "pointer",
  //         }}
  //         rounded="md"
  //         pl="3"
  //         py="2"
  //       >
  //         <Checkbox
  //           onChange={() => onCheckboxClick(task)}
  //           isChecked={task.status === "done"}
  //         >
  //           <Text>{task.name}</Text>
  //         </Checkbox>
  //       </Box>
  //     </Box>
  //   </Box>
  // );
}
