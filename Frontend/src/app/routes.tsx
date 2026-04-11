import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
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
    ],
  },
]);
