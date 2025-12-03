"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { TUser } from "../types";

interface TUserContextType {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  logout: () => void;
}
export const UserContext = createContext<TUserContextType | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUserState] = useState<TUser | null>(null);
  const setUser = (user: TUser | null) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUserState(user);
  };
  const logout = () => {
    localStorage.clear();
    setUserState(null);
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserState(JSON.parse(user));
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("Context Error");

  return {
    user: context.user,
    setUser: context.setUser,
    logout: context.logout,
  };
}
