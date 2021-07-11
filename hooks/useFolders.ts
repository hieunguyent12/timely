import { useState, useEffect } from "react";

export default function useFolders() {
  const [folders, setFolders] = useState(null);

  useEffect(() => {
    async function fetchData() {}

    fetchData();
  }, []);

  return folders;
}
