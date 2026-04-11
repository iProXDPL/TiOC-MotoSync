import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  getRepairById,
  saveRepair,
  getVehicleById,
  getMessages,
  saveMessage,
  getUsers,
} from "../utils/storage";
import { useAppUser } from "../hooks/useAppUser";
import { Repair, RepairStatus, Message } from "../types";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Send,
} from "lucide-react";

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

export function RepairDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppUser();
  const [repair, setRepair] = useState<Repair | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [additionalIssues, setAdditionalIssues] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [finalCost, setFinalCost] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    if (!user || !id) {
      navigate("/");
      return;
    }

    loadRepair();
  }, [user, id, navigate]);

  const loadRepair = () => {
    if (!id) return;
    const repairData = getRepairById(id);
    if (repairData) {
      setRepair(repairData);
      setMechanicNotes(repairData.mechanicNotes || "");
      setAdditionalIssues(repairData.additionalIssues || "");
      setEstimatedCost(repairData.estimatedCost?.toString() || "");
      setFinalCost(repairData.finalCost?.toString() || "");
      setScheduledDate(repairData.scheduledDate || "");
      setMessages(getMessages(id));
    }
  };

  const handleStatusChange = (newStatus: RepairStatus) => {
    if (!repair) return;

    const updated: Repair = {
      ...repair,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      mechanicNotes,
      additionalIssues,
      scheduledDate,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      finalCost: finalCost ? parseFloat(finalCost) : undefined,
      completedDate: newStatus === "completed" ? new Date().toISOString() : repair.completedDate,
    };

    saveRepair(updated);
    loadRepair();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !repair || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      repairId: repair.id,
      senderId: user.id,
      senderRole: user.role,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    saveMessage(message);
    setNewMessage("");
    loadRepair();
  };

  const handleUpdateDetails = () => {
    if (!repair) return;

    const updated: Repair = {
      ...repair,
      mechanicNotes,
      additionalIssues,
      scheduledDate,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      finalCost: finalCost ? parseFloat(finalCost) : undefined,
      updatedAt: new Date().toISOString(),
    };

    saveRepair(updated);
    loadRepair();
  };

  if (!repair) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 dark:text-neutral-400">Nie znaleziono naprawy</p>
      </div>
    );
  }

  const vehicle = getVehicleById(repair.vehicleId);
  const isMechanic = user?.role === "mechanic";
  const backPath = isMechanic ? "/mechanic" : "/client";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót do panelu
      </button>

      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {vehicle?.brand} {vehicle?.model}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {vehicle?.licensePlate} • VIN: {vehicle?.vin}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded ${statusColors[repair.status]}`}
            >
              {statusLabels[repair.status]}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Opis usterki</p>
              <p className="text-neutral-900 dark:text-white mt-1">{repair.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500">Data zgłoszenia</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {new Date(repair.createdAt).toLocaleDateString("pl-PL")}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Preferowany termin</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {new Date(repair.requestedDate).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isMechanic && (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Zarządzanie naprawą</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Zaplanowany termin
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Notatki mechanika
                </label>
                <textarea
                  value={mechanicNotes}
                  onChange={(e) => setMechanicNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  placeholder="Dodaj notatki dotyczące naprawy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Dodatkowe usterki wykryte podczas przeglądu
                </label>
                <textarea
                  value={additionalIssues}
                  onChange={(e) => setAdditionalIssues(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  placeholder="Opisz dodatkowe problemy wykryte podczas naprawy..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Szacowany koszt (zł)
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Finalny koszt (zł)
                  </label>
                  <input
                    type="number"
                    value={finalCost}
                    onChange={(e) => setFinalCost(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zapisz zmiany
              </button>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Zmień status</p>
                <div className="flex flex-wrap gap-2">
                  {repair.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange("confirmed")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Potwierdź
                    </button>
                  )}
                  {repair.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusChange("in_progress")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Rozpocznij naprawę
                    </button>
                  )}
                  {repair.status === "in_progress" && (
                    <>
                      <button
                        onClick={() => handleStatusChange("awaiting_approval")}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Wymaga akceptacji klienta
                      </button>
                      <button
                        onClick={() => handleStatusChange("ready")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Gotowe do odbioru
                      </button>
                    </>
                  )}
                  {repair.status === "awaiting_approval" && (
                    <button
                      onClick={() => handleStatusChange("in_progress")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Kontynuuj naprawę
                    </button>
                  )}
                  {repair.status === "ready" && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Zakończ naprawę
                    </button>
                  )}
                  {!["completed", "cancelled"].includes(repair.status) && (
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Anuluj
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMechanic && repair.mechanicNotes && (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Notatki mechanika</h3>
            <p className="text-blue-800">{repair.mechanicNotes}</p>
          </div>
        )}

        {!isMechanic && repair.additionalIssues && (
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-orange-900 mb-2">
                  Dodatkowe usterki wykryte podczas przeglądu
                </h3>
                <p className="text-orange-800">{repair.additionalIssues}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Komunikacja
          </h3>

          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">Brak wiadomości</p>
            ) : (
              messages.map((msg) => {
                const sender = getUsers().find((u) => u.id === msg.senderId);
                const isCurrentUser = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      isCurrentUser ? "bg-blue-50 dark:bg-blue-900 ml-8" : "bg-neutral-50 dark:bg-neutral-700 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{sender?.name}</p>
                      <span className="text-xs text-neutral-500">
                        {msg.senderRole === "mechanic" ? "Mechanik" : "Klient"}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(msg.timestamp).toLocaleString("pl-PL")}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-white">{msg.content}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Napisz wiadomość..."
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
