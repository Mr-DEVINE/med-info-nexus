
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "doctor" | "patient" | "researcher" | "student" | "bloodbank" | "pharmaceutical" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <UserContext.Provider value={{
      role,
      setRole,
      isAuthenticated,
      setIsAuthenticated,
      username,
      setUsername
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
