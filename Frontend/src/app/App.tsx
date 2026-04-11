import { RouterProvider } from "react-router";
import { ClerkProvider } from "@clerk/react";
import { ThemeProvider } from "next-themes";
import { router } from "./routes";

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk";

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </ClerkProvider>
  );
}