import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  studentNumber?: string;
  program?: string;
  yearOfStudy?: number;
  careerInterests?: string[];
  phone?: string;
  campus?: string;
  joinedDate: string;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentNumber?: string;
  program?: string;
  phone?: string;
  campus?: string;
}

// Mock users database
const MOCK_USERS: { user: User; password: string }[] = [
  {
    password: "student123",
    user: {
      id: "1",
      firstName: "Thabo",
      lastName: "Mokoena",
      email: "student@belgiumcampus.ac.za",
      role: "student",
      studentNumber: "BC220012345",
      program: "BSc Information Technology",
      yearOfStudy: 2,
      careerInterests: ["Software Development", "Cloud Computing"],
      phone: "+27 71 234 5678",
      campus: "Pretoria",
      joinedDate: "2024-02-01",
      avatarInitials: "TM",
    },
  },
  {
    password: "admin123",
    user: {
      id: "2",
      firstName: "Dr. Nomsa",
      lastName: "Dlamini",
      email: "admin@belgiumcampus.ac.za",
      role: "admin",
      phone: "+27 12 460 9266",
      campus: "Pretoria",
      joinedDate: "2020-01-15",
      avatarInitials: "ND",
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "bc_coursefinder_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const found = MOCK_USERS.find(
      (u) => u.user.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setUser(found.user);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password. Please try again." };
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    const exists = MOCK_USERS.find((u) => u.user.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: "student",
      studentNumber: data.studentNumber,
      program: data.program,
      phone: data.phone,
      campus: data.campus,
      careerInterests: [],
      joinedDate: new Date().toISOString().split("T")[0],
      avatarInitials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
    };
    MOCK_USERS.push({ user: newUser, password: data.password });
    setUser(newUser);
    return { success: true };
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    updated.avatarInitials = `${updated.firstName[0]}${updated.lastName[0]}`.toUpperCase();
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
