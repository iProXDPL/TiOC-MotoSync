import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getVehicles, getRepairs } from "../utils/storage";
import { useAppUser } from "../hooks/useAppUser";
import { Vehicle, Repair, RepairStatus } from "../types";
import { Car, Plus, Calendar, History, Clock, CheckCircle, AlertCircle } from "lucide-react";

const statusColors: Record<RepairStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  awaiting_approval: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-neutral-100 text-neutral-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<RepairStatus, string> = {
  pending: "Oczekuje",
  confirmed: "Potwierdzone",
  in_progress: "W trakcie",
  awaiting_approval: "Wymaga akceptacji",
  ready: "Gotowe do odbioru",
  completed: "Zakończone",
  cancelled: "Anulowane",
};

export function ClientDashboard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const user = useAppUser();

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/");
      return;
    }

    setVehicles(getVehicles(user.id));
    setRepairs(getRepairs({ userId: user.id }));
  }, [user, navigate]);

  const activeRepairs = repairs.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:text-white mb-2">Panel klienta</h2>
        <p className="text-neutral-600 dark:text-neutral-400 dark:text-neutral-400">Witaj, {user?.name}</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Twoje pojazdy</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{vehicles.length}</p>
            </div>
            <Car className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Aktywne naprawy</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{activeRepairs.length}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Zakończone</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {repairs.filter((r) => r.status === "completed").length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Moje pojazdy</h3>
            <button
              onClick={() => navigate("/vehicles")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj pojazd
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <Car className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p>Nie masz jeszcze dodanych pojazdów</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 dark:group-hover:text-neutral-200">
                        {vehicle.year} • {vehicle.licensePlate}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/booking", { state: { vehicleId: vehicle.id } })}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Umów wizytę
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Aktywne naprawy</h3>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 dark:text-white hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              Historia
            </button>
          </div>

          {activeRepairs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p>Brak aktywnych napraw</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRepairs.map((repair) => {
                const vehicle = vehicles.find((v) => v.id === repair.vehicleId);
                return (
                  <div
                    key={repair.id}
                    onClick={() => navigate(`/repair/${repair.id}`)}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {vehicle?.brand} {vehicle?.model}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 dark:group-hover:text-neutral-200 line-clamp-1">
                          {repair.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          statusColors[repair.status]
                        }`}
                      >
                        {statusLabels[repair.status]}
                      </span>
                    </div>
                    {repair.status === "awaiting_approval" && repair.additionalIssues && (
                      <div className="mt-2 flex items-start gap-2 p-2 bg-orange-50 rounded text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-orange-800">Wykryto dodatkowe usterki</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
