import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Box, useToast } from "@chakra-ui/react";

import parseUser from "../utils/parseUser";
import { UserType, FolderType } from "../types/api";
import { useUser } from "../components/shared/UserContext";
import connectDB from "../db/connectDB";
import Folder from "../db/folderModel";
import FoldersList from "../components/FoldersList";

interface Props {
  user: UserType | null;
  folders: FolderType[] | null;
}

export default function Dashboard({ user, folders }: Props) {
  const { user: userContext, dispatch } = useUser();
  const toast = useToast();

  // TODO can we make it so that we only need to this once?
  useEffect(() => {
    if (user && !userContext) {
      dispatch(user);
    }
  }, [user, dispatch, userContext]);

  if (!user) {
    return <p>You are not logged in to view this page</p>;
  }

  return (
    <Box>
      <Box
        maxWidth="1000px"
        w="100%"
        d="flex"
        flexDirection="column"
        alignItems="center"
      >
        <FoldersList folders={folders} />
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType | null = parseUser(ctx);
  let folders: FolderType[] | null = null;

  if (user) {
    await connectDB();

    folders = await Folder.find({
      owner: user.userId,
    });
  }

  return {
    props: {
      user,
      folders: JSON.parse(JSON.stringify(folders)),
    },
  };
};
