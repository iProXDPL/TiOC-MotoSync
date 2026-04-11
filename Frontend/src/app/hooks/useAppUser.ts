import { useUser } from "@clerk/react";
import { useMemo } from "react";
import { User } from "../types";

export function useAppUser(): User | null {
  const { user, isLoaded, isSignedIn } = useUser();

  return useMemo(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return null;
    }

    const role = user.publicMetadata?.role === "mechanic" ? "mechanic" : "client";

    return {
      id: user.id,
      name: user.fullName || user.firstName || user.username || "Użytkownik",
      email: user.primaryEmailAddress?.emailAddress || "",
      role: role,
    };
  }, [isLoaded, isSignedIn, user]);
}
