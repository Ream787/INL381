import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  // Auth pages (standalone, no layout)
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },

  // Main app (with header layout)
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
