import {
  Box,
  Avatar,
  IconButton,
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";

import { useUser } from "./shared/UserContext";
import Search from "./Search";

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  const onProfileClick = () => {
    // Show modal with profile details
    // /profile route but still show everything else on page
    router.push(`${location.pathname}?modal=profile`);
  };

  if (user) {
    return (
      <Box d="flex" justifyContent="center" boxShadow="sm">
        <Box
          d="flex"
          py="3"
          justifyContent="space-evenly"
          alignItems="center"
          maxWidth="1000px"
          w="90%"
        >
          <Link href="/dashboard" passHref>
            <a>
              <Text fontSize="xl">⏰ Timely</Text>
            </a>
          </Link>
          <Search />
          <Box>
            <IconButton
              icon={<BellIcon fontSize="md" w={5} h={5} />}
              aria-label="See notification"
              as={Button}
              size="sm"
            />
            <Avatar size="sm" ml="5" onClick={onProfileClick} />
          </Box>
        </Box>
      </Box>
    );
  }

  return <div>Navbar loading...</div>;
}
