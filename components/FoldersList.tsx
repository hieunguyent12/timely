import { useState, useCallback, useEffect } from "react";
import { Text, Button, Box, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

import { FolderType } from "../types/api";
import FolderItem from "./FolderItem";

interface Props {
  folders: FolderType[] | null;
}

export default function FoldersList({ folders: _folders }: Props) {
  const [folders, setFolders] = useState(_folders);

  const [, drop] = useDrop(
    () => ({
      accept: "FOLDER_ITEM",

      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        handlerId: monitor.getHandlerId(),
      }),
      drop: () => {
        // const foldersOrder = localStorage.getItem("foldersOrder");
        localStorage.setItem("foldersOrder", JSON.stringify(folders));
      },
    }),
    [folders]
  );

  const toast = useToast();

  useEffect(() => {
    const foldersOrder = localStorage.getItem("foldersOrder");
    if (foldersOrder) {
      setFolders(JSON.parse(foldersOrder));
    }
  }, []);

  const onNewFolder = async () => {
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `test folder ${Math.random()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok && data.error) {
      toast({
        title: "Error creating folder",
        description: data.error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
    }
  };

  const findFolder = useCallback(
    (id: string): { folder: FolderType; index: number } | null => {
      if (folders) {
        const folder = folders.filter((folder) => folder._id === id)[0];
        return {
          folder,
          index: folders.indexOf(folder),
        };
      }

      return null;
    },
    [folders]
  );

  const moveFolder = useCallback(
    (id: string, atIndex: number) => {
      const data = findFolder(id);

      if (data && folders) {
        const { folder, index } = data;

        setFolders(
          update(folders, {
            $splice: [
              [index, 1],
              [atIndex, 0, folder],
            ],
          })
        );
      }
    },
    [folders, setFolders, findFolder]
  );

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        mx="auto"
        // maxW="100%"
      >
        <Text fontWeight="bold" fontSize="20px" flex="1">
          My Folders
        </Text>
        <Button
          onClick={onNewFolder}
          size="sm"
          colorScheme="twitter"
          leftIcon={<AddIcon />}
        >
          new
        </Button>
      </Box>
      <Box mt="3" ref={drop} w="500px" mx="auto">
        {folders &&
          folders.map((folder, index) => (
            <FolderItem
              key={folder._id}
              folder={folder}
              index={index}
              moveFolder={moveFolder}
            />
          ))}
      </Box>
    </>
  );
}
