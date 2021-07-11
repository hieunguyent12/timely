import { GetServerSideProps } from "next";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

import Task from "../../db/taskModel";
import Folder from "../../db/folderModel";
import parseUser from "../../utils/parseUser";
import { UserType, TaskType, FolderType } from "../../types/api";
import connectDB from "../../db/connectDB";
import { useUser } from "../../components/shared/UserContext";
import TasksList from "../../components/tasks/TasksList";

interface Props {
  user: UserType | null;
  tasks: TaskType[] | null;
  folder: FolderType | null;
}

export default function FolderPage({ user, tasks, folder }: Props) {
  const { user: userContext, dispatch } = useUser();

  useEffect(() => {
    if (user && !userContext) {
      dispatch(user);
    }
  }, [user, dispatch, userContext]);

  return (
    <Box>
      <TasksList folder={folder} _tasks={tasks} _subtasks={null} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType | null = parseUser(ctx);
  let tasks: TaskType[] | null = null;
  let folder: FolderType | null = null;

  if (user) {
    await connectDB();
    tasks = await Task.find({
      owner: user.userId,
      folderId: ctx.params?.id,
    });

    folder = await Folder.findById(ctx.params?.id);
  }

  return {
    props: {
      user,
      tasks: JSON.parse(JSON.stringify(tasks)),
      folder: JSON.parse(JSON.stringify(folder)),
    },
  };
};
