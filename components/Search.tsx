import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";

import { TaskType, FolderType } from "../types/api";

interface Props {
  searchResults: {
    folders: FolderType[];
    tasks: TaskType[];
  } | null;
}

function SearchResult({ searchResults }: Props) {
  const renderResults = () => {
    if (searchResults) {
      const totalMatches =
        searchResults.folders.length + searchResults.tasks.length;
      const tasks = searchResults.tasks.map((result) => (
        <Text key={result._id} className="searchItem">
          {result.name}
        </Text>
      ));
      const folders = searchResults.folders.map((result) => (
        <Text key={result._id} className="searchItem">
          {result.name}
        </Text>
      ));

      return (
        <Box>
          <Text fontSize="sm">Found {totalMatches} matches</Text>
          {searchResults.tasks.length > 0 && (
            <>
              <Text>Tasks</Text>
              <Divider />
              {tasks}
            </>
          )}

          {searchResults.folders.length > 0 && (
            <>
              <Text>Folders</Text>
              <Divider />
              {folders}
            </>
          )}
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    searchResults && (
      <Box
        position="absolute"
        background="white"
        w="100%"
        p="2"
        mt="1"
        left="-30%"
        boxShadow="md"
        zIndex="9999"
        className="searchResults"
        width="300px"
      >
        {renderResults()}
      </Box>
    )
  );
}

// TODO implement partial text search

export default function Search() {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<{
    folders: FolderType[];
    tasks: TaskType[];
  } | null>(null);

  useEffect(() => {
    // hide the results on click outside
    function callback(e: MouseEvent) {
      if (searchResults) {
        if (
          !(e.target as HTMLElement)?.classList.contains("searchInput") &&
          !(e.target as HTMLElement)?.classList.contains("searchResults") &&
          !(e.target as HTMLElement)?.classList.contains("searchItem")
        ) {
          setSearchResults(null);
        }
      }
    }
    window.addEventListener("mousedown", callback);

    return () => window.removeEventListener("mousedown", callback);
  }, [searchResults]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      // console.log(query);
      const response = await fetch(
        `/api/search?search=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (response.ok && !data.error) {
        setSearchResults(data);
      }
    }, 1000),
    []
  );

  return (
    <Box maxWidth="30%" position="relative">
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search anything"
          variant="filled"
          borderRadius="5px"
          value={input}
          onChange={(e) => {
            debouncedSearch(e.target.value);
            setInput(e.target.value);
          }}
          className="searchInput"
        />
      </InputGroup>
      {input && <SearchResult searchResults={searchResults} />}
    </Box>
  );
}
