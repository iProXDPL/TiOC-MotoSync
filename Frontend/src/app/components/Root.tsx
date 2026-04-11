import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth, useUser, useClerk } from "@clerk/react";
import { LogOut, Car } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Root() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader = ["/sign-in", "/sign-up", "/select-role", "/"].includes(location.pathname);

  const handleLogoClick = () => {
    if (!user) return;
    const role = user.publicMetadata?.role;
    if (role === "mechanic") {
      navigate("/mechanic");
    } else {
      navigate("/client");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {!hideHeader && isSignedIn && (
        <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="font-semibold text-xl text-neutral-900 dark:text-white">
                  MotoSync
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                {user && (
                  <>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {user.firstName || user.username}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Wyloguj
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
