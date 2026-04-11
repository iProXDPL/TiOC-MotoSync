import { SignIn as ClerkSignIn } from "@clerk/react-router";
import { Car } from "lucide-react";

export function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">MotoSync</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Zaloguj się do systemu zarządzania warsztatem
        </p>
      </div>

      <div className="w-full max-w-md">
        <ClerkSignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl rounded-2xl border border-neutral-200 dark:border-neutral-700",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/select-role"
        />
      </div>
    </div>
  );
}
