import { useNavigate } from "react-router";
import { useAuth, useUser } from "@clerk/react-router";
import { useEffect } from "react";

export function SelectRole() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        navigate("/sign-in");
      } else if (user) {
        const role = user.publicMetadata?.role;
        if (role === "mechanic") {
          navigate("/mechanic");
        } else {
          navigate("/client");
        }
      }
    }
  }, [isLoaded, isSignedIn, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-400">Przekierowywanie...</p>
      </div>
    </div>
  );
}
