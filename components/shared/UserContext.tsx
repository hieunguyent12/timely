import React, { useContext, createContext, useState } from "react";

import { UserType } from "../../types/api";

const UserStateContext = createContext<{
  user: UserType | null;
  dispatch: React.Dispatch<UserType | null>;
} | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const value = { user, dispatch: setUser };
  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserStateContext);

  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }

  return context;
};
