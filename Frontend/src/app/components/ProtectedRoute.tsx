import { useUser } from "@clerk/react-router";
import { Navigate } from "react-router";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "client" | "mechanic";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requiredRole) {
    const role = user?.publicMetadata?.role === "mechanic" ? "mechanic" : "client";
    if (role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
