import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getVehicles, saveVehicle } from "../utils/storage";
import { useAppUser } from "../hooks/useAppUser";
import { Vehicle } from "../types";
import { Car, Plus, ArrowLeft } from "lucide-react";

export function VehicleList() {
  const navigate = useNavigate();
  const user = useAppUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    mileage: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/");
      return;
    }
    loadVehicles();
  }, [user, navigate]);

  const loadVehicles = () => {
    setVehicles(getVehicles(user?.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      userId: user!.id,
      ...formData,
    };
    saveVehicle(newVehicle);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      vin: "",
      licensePlate: "",
      mileage: 0,
    });
    setShowForm(false);
    loadVehicles();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/client")}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do panelu
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Moje pojazdy</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Dodaj pojazd
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Nowy pojazd</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Marka
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. Toyota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. Corolla"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Rok produkcji
                </label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nr rejestracyjny
                </label>
                <input
                  type="text"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. WA 12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  VIN
                </label>
                <input
                  type="text"
                  required
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="17-znakowy numer VIN"
                  maxLength={17}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Przebieg (km)
                </label>
                <input
                  type="number"
                  required
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dodaj pojazd
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 p-12 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Brak pojazdów</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Dodaj swój pierwszy pojazd, aby móc umawiać wizyty w warsztacie
            </p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                      <p>Rok: {vehicle.year}</p>
                      <p>Nr rej.: {vehicle.licensePlate}</p>
                      <p>VIN: {vehicle.vin}</p>
                      <p>Przebieg: {vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/booking", { state: { vehicleId: vehicle.id } })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Umów wizytę
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
