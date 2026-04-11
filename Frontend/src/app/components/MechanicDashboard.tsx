import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAppUser } from "../hooks/useAppUser";
import { useApi } from "../hooks/useApi";
import { Repair, RepairStatus } from "../types";
import { Clock, CheckCircle, AlertCircle, Wrench, Search } from "lucide-react";

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

export function MechanicDashboard() {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RepairStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const user = useAppUser();

  const api = useApi();

  useEffect(() => {
    if (!user || user.role !== "mechanic") {
      navigate("/");
      return;
    }

    loadRepairs();
  }, [user, navigate]);

  const loadRepairs = async () => {
    try {
      const data = await api.get('/reports');
      const mappedRepairs = data.map((report: any) => ({
        id: report._id,
        vehicleBrand: report.carId?.make,
        vehicleModel: report.carId?.model,
        vehicleLicensePlate: report.carId?.licensePlate,
        vehicleVin: report.carId?.vin,
        status: report.status,
        description: report.description,
        createdAt: report.createdAt,
        scheduledDate: report.scheduledDate,
      }));
      setRepairs(mappedRepairs);
    } catch (err) {
      console.error("Failed to load repairs for mechanic:", err);
    }
  };

  const handleConfirm = async (repair: any) => {
    try {
      await api.put(`/reports/${repair.id}/status`, {
        status: "confirmed"
      });
      loadRepairs();
    } catch (err) {
      console.error("Failed to confirm repair", err);
    }
  };

  const pendingRepairs = repairs.filter((r) => r.status === "pending");
  const confirmedRepairs = repairs.filter((r) => r.status === "confirmed");
  const inProgressRepairs = repairs.filter((r) => r.status === "in_progress");

  const filteredAndSortedRepairs = repairs
    .filter((repair: any) => {
      const searchLower = searchQuery.toLowerCase();
      
      const matchesSearch = 
        !searchQuery ||
        (repair.vehicleBrand && repair.vehicleBrand.toLowerCase().includes(searchLower)) ||
        (repair.vehicleModel && repair.vehicleModel.toLowerCase().includes(searchLower)) ||
        (repair.vehicleLicensePlate && repair.vehicleLicensePlate.toLowerCase().includes(searchLower)) ||
        new Date(repair.createdAt).toLocaleDateString("pl-PL").includes(searchLower) ||
        repair.description.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "all" || repair.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Panel mechanika</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Witaj, {user?.name}</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Nowe zgłoszenia</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{pendingRepairs.length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Potwierdzone</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{confirmedRepairs.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">W trakcie</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{inProgressRepairs.length}</p>
            </div>
            <Wrench className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Dzisiaj</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {repairs.filter(
                  (r) =>
                    r.scheduledDate &&
                    new Date(r.scheduledDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {pendingRepairs.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Nowe zgłoszenia ({pendingRepairs.length})
            </h3>
            <div className="space-y-3">
              {pendingRepairs.map((repair: any) => {
                return (
                  <div
                    key={repair.id}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {repair.vehicleBrand} {repair.vehicleModel}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[repair.status as RepairStatus] || "bg-gray-100 text-gray-800"}`}>
                            {statusLabels[repair.status as RepairStatus] || repair.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-200 mb-1">
                          {repair.vehicleLicensePlate} • VIN: {repair.vehicleVin}
                        </p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 dark:group-hover:text-white mb-2">{repair.description}</p>
                        {repair.scheduledDate && (
                          <p className="text-xs text-neutral-500">
                            Preferowany termin: {new Date(repair.scheduledDate).toLocaleDateString("pl-PL")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/repair/${repair.id}`)}
                          className="px-4 py-2 text-sm border border-neutral-300 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 dark:hover:text-white transition-colors"
                        >
                          Szczegóły
                        </button>
                        <button
                          onClick={() => handleConfirm(repair)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Potwierdź
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Wszystkie naprawy</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Szukaj (pojazd, data, opis)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RepairStatus | "all")}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Oczekuje</option>
              <option value="confirmed">Potwierdzone</option>
              <option value="in_progress">W trakcie</option>
              <option value="awaiting_approval">Wymaga akceptacji</option>
              <option value="ready">Gotowe do odbioru</option>
              <option value="completed">Zakończone</option>
              <option value="cancelled">Anulowane</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
            >
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
            </select>
          </div>
          <div className="space-y-3">
            {filteredAndSortedRepairs.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Wrench className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p>Brak zleceń</p>
              </div>
            ) : (
              filteredAndSortedRepairs.map((repair: any) => {
                return (
                  <div
                    key={repair.id}
                    onClick={() => navigate(`/repair/${repair.id}`)}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {repair.vehicleBrand} {repair.vehicleModel}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[repair.status as RepairStatus] || "bg-gray-100 text-gray-800"}`}>
                            {statusLabels[repair.status as RepairStatus] || repair.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-200 line-clamp-1">{repair.description}</p>
                        {repair.scheduledDate && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Termin: {new Date(repair.scheduledDate).toLocaleDateString("pl-PL")}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                          Dodano: {new Date(repair.createdAt).toLocaleDateString("pl-PL")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
