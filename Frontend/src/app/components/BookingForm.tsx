import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { getVehicles, saveRepair } from "../utils/storage";
import { useAppUser } from "../hooks/useAppUser";
import { Vehicle, Repair } from "../types";
import { ArrowLeft, Calendar } from "lucide-react";

export function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [requestedDate, setRequestedDate] = useState("");

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/");
      return;
    }

    const userVehicles = getVehicles(user.id);
    setVehicles(userVehicles);

    const preselectedVehicleId = location.state?.vehicleId;
    if (preselectedVehicleId) {
      setSelectedVehicleId(preselectedVehicleId);
    } else if (userVehicles.length > 0) {
      setSelectedVehicleId(userVehicles[0].id);
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRequestedDate(tomorrow.toISOString().split("T")[0]);
  }, [user, navigate, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId || !description || !requestedDate) {
      return;
    }

    const newRepair: Repair = {
      id: `repair-${Date.now()}`,
      vehicleId: selectedVehicleId,
      userId: user!.id,
      status: "pending",
      description,
      requestedDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveRepair(newRepair);
    navigate("/client");
  };

  if (vehicles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-neutral-800 p-12 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Brak pojazdów</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Najpierw dodaj pojazd, aby móc umówić wizytę
          </p>
          <button
            onClick={() => navigate("/vehicles")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dodaj pojazd
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/client")}
        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót do panelu
      </button>

      <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Umów wizytę</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Wybierz pojazd
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Opis usterki
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder="Opisz co jest nie tak z pojazdem..."
              required
            />
            <p className="mt-1 text-xs text-neutral-500">
              Podaj jak najwięcej szczegółów - objawy, dźwięki, kiedy występuje problem itp.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Preferowany termin
            </label>
            <input
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <p className="mt-1 text-xs text-neutral-500">
              Mechanik potwierdzi dokładny termin po sprawdzeniu dostępności
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Wyślij zgłoszenie
            </button>
            <button
              type="button"
              onClick={() => navigate("/client")}
              className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 dark:hover:text-white transition-colors"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
