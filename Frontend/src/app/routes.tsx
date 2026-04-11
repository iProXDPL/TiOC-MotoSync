import { createBrowserRouter, Navigate, useRouteError, isRouteErrorResponse } from "react-router";
import { Root } from "./components/Root";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { SelectRole } from "./components/SelectRole";
import { ClientDashboard } from "./components/ClientDashboard";
import { MechanicDashboard } from "./components/MechanicDashboard";
import { VehicleList } from "./components/VehicleList";
import { BookingForm } from "./components/BookingForm";
import { RepairHistory } from "./components/RepairHistory";
import { RepairDetail } from "./components/RepairDetail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Car } from "lucide-react";

function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          {is404 ? "404" : "Błąd"}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {is404
            ? "Nie znaleziono strony, której szukasz."
            : "Wystąpił nieoczekiwany błąd."}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Wróć na stronę główną
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <SelectRole /> },
      { path: "sign-in/*", Component: SignIn },
      { path: "sign-up/*", Component: SignUp },
      { path: "select-role", Component: SelectRole },
      {
        path: "client",
        element: (
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "mechanic",
        element: (
          <ProtectedRoute>
            <MechanicDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "vehicles",
        element: (
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <RepairHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "repair/:id",
        element: (
          <ProtectedRoute>
            <RepairDetail />
          </ProtectedRoute>
        ),
      },
      // Catch-all: redirect unknown paths to home
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
