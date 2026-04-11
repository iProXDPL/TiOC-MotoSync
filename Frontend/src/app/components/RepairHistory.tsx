import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getRepairs, getVehicles } from "../utils/storage";
import { useAppUser } from "../hooks/useAppUser";
import { Repair, RepairStatus } from "../types";
import { ArrowLeft, History } from "lucide-react";

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

export function RepairHistory() {
  const navigate = useNavigate();
  const user = useAppUser();
  const [repairs, setRepairs] = useState<Repair[]>([]);

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/");
      return;
    }

    setRepairs(getRepairs({ userId: user.id }));
  }, [user, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/client")}
        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót do panelu
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Historia napraw</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Wszystkie zgłoszenia i naprawy</p>
      </div>

      {repairs.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 p-12 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
          <History className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Brak historii</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Nie masz jeszcze żadnych zgłoszeń napraw</p>
        </div>
      ) : (
        <div className="space-y-4">
          {repairs.map((repair) => {
            const vehicle = getVehicles().find((v) => v.id === repair.vehicleId);
            return (
              <div
                key={repair.id}
                onClick={() => navigate(`/repair/${repair.id}`)}
                className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {vehicle?.brand} {vehicle?.model}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          statusColors[repair.status]
                        }`}
                      >
                        {statusLabels[repair.status]}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{repair.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-500">Data zgłoszenia</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {new Date(repair.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                  {repair.scheduledDate && (
                    <div>
                      <p className="text-xs text-neutral-500">Zaplanowany termin</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {new Date(repair.scheduledDate).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  )}
                  {repair.completedDate && (
                    <div>
                      <p className="text-xs text-neutral-500">Data zakończenia</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {new Date(repair.completedDate).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  )}
                  {repair.finalCost && (
                    <div>
                      <p className="text-xs text-neutral-500">Koszt</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {repair.finalCost} zł
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
