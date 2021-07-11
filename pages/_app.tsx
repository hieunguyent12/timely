import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
// import "../styles/datepicker.css";

import { SearchProvider } from "../components/shared/SearchContext";
import { UserProvider } from "../components/shared/UserContext";
import Navbar from "../components/Navbar";
import ProfileModal from "../components/ProfileModal";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ChakraProvider>
      <UserProvider>
        <SearchProvider>
          <DndProvider backend={HTML5Backend}>
            <Navbar />
            <Box d="flex" justifyContent="center" pt="5">
              <Component {...pageProps} />
            </Box>
            {router.query?.modal === "profile" &&
              typeof window !== "undefined" &&
              mounted && <ProfileModal path={location.pathname} />}
          </DndProvider>
        </SearchProvider>
      </UserProvider>
    </ChakraProvider>
  );
}
export default MyApp;
