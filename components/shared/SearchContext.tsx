import React, { useContext, createContext, useState } from "react";

const SearchContext = createContext<{
  items: any[];
  setItems: React.Dispatch<any>;
} | null>(null);

export const SearchProvider: React.FC = ({ children }) => {
  const [items, setItems] = useState([]);

  const value = { items, setItems };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }

  return context;
};
