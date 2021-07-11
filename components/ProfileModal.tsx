import { Button, Avatar, Box, Text, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import ModalComponent from "./shared/Modal";
import { useUser } from "./shared/UserContext";

interface Props {
  path: string;
}

export default function ProfileModal({ path }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onClose = () => {
    router.push(path);
  };

  const onUploadFile = () => {
    if (inputRef) {
      // @ts-ignore
      const file = inputRef.current?.files[0];

      if (file) {
        const fsMb = file.size / (1024 * 1024);
        const MAX_FILE_SIZE = 5;

        if (file.type.startsWith("image/")) {
          if (fsMb < MAX_FILE_SIZE) {
            setPhoto(URL.createObjectURL(file));
          } else {
            console.log("file is too large");
          }
        } else {
          console.log("invalid file type");
        }
      }
    }
  };

  if (user) {
    return (
      <ModalComponent
        onClose={onClose}
        title="My Profile"
        renderBody={() => {
          return (
            <Box d="flex" alignItems="center">
              <Avatar src={photo} onClick={() => inputRef.current?.click()} />
              <Text ml="2">{user.name}</Text>
              <Input
                type="file"
                onChange={onUploadFile}
                ref={inputRef}
                d="none"
              />
            </Box>
          );
        }}
        renderFooter={() => {
          return <Button onClick={onClose}>Close</Button>;
        }}
      />
    );
  } else {
    return null;
  }
}
