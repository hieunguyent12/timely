import { Text, Box } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";
import { useRouter } from "next/router";
// import { DragHandleIcon } from "@chakra-ui/icons";

import { FolderType } from "../types/api";

interface Props {
  folder: FolderType;
  index: number;
  moveFolder: (id: string, index: number) => void;
}

interface DragItem {
  id: string;
  originalIndex: number;
  name: string;
}

// BUG Fix glitchy hover effects when dragging
export default function FolderItem({ folder, index, moveFolder }: Props) {
  const router = useRouter();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "FOLDER_ITEM",
      item: { id: folder._id, index, name: folder.name },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor) => {
        const { id: droppedId, index } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop && index) {
          moveFolder(droppedId, index);
        }
      },
    }),
    [folder._id, index, moveFolder]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "FOLDER_ITEM",
      canDrop: () => false,
      hover({ id: draggedId }: DragItem) {
        if (draggedId !== folder._id) {
          moveFolder(draggedId, index);
        }
      },
    }),
    [moveFolder]
  );

  const onFolderClick = () => {
    router.push(`/folder/${folder._id}`);
  };

  return (
    <Box
      w="105%"
      _hover={{
        bgColor: "gray.100",
        cursor: "pointer",
      }}
      transition="0.2s"
      pl="3"
      py="2"
      mt="1"
      rounded="md"
      ref={(node) => drag(drop(node))}
      opacity={isDragging ? "0.5" : "1"}
      onClick={onFolderClick}
      position="relative"
      right="10px"
    >
      <Text>{folder.name}</Text>
    </Box>
  );
}
