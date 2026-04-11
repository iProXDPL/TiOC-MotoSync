import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAppUser } from "../hooks/useAppUser";
import { useApi } from "../hooks/useApi";
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
  const [repair, setRepair] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [additionalIssues, setAdditionalIssues] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [finalCost, setFinalCost] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const api = useApi();

  useEffect(() => {
    if (!user || !id) {
      navigate("/");
      return;
    }

    loadRepair();
  }, [user, id, navigate]);

  const loadRepair = async () => {
    if (!id) return;
    try {
      const data = await api.get(`/reports/${id}`);
      setRepair(data);
      setMechanicNotes(data.mechanicNotes || "");
      setAdditionalIssues(data.additionalIssues || "");
      setEstimatedCost(data.estimatedCost?.toString() || "");
      setFinalCost(data.finalCost?.toString() || "");
      
      const parsedSchDate = data.scheduledDate ? new Date(data.scheduledDate).toISOString().split('T')[0] : "";
      setScheduledDate(parsedSchDate);
      
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load repair details:", err);
    }
  };

  const handleStatusChange = async (newStatus: RepairStatus) => {
    if (!repair) return;

    try {
      await api.put(`/reports/${id}/status`, {
        status: newStatus,
        mechanicNotes,
        additionalIssues,
        scheduledDate,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        finalCost: finalCost ? parseFloat(finalCost) : undefined,
        completedDate: newStatus === "completed" ? new Date().toISOString() : repair.completedDate,
      });
      if (newStatus === "completed" || newStatus === "cancelled") {
        navigate(backPath);
      } else {
        loadRepair();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !repair || !user) return;

    try {
      await api.post(`/reports/${id}/messages`, {
        content: newMessage
      });
      setNewMessage("");
      loadRepair();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleUpdateDetails = async () => {
    if (!repair) return;

    try {
      await api.put(`/reports/${id}/details`, {
        mechanicNotes,
        additionalIssues,
        scheduledDate,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        finalCost: finalCost ? parseFloat(finalCost) : undefined,
      });
      loadRepair();
    } catch (err) {
      console.error("Failed to update details", err);
    }
  };

  if (!repair) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 dark:text-neutral-400">Nie znaleziono naprawy</p>
      </div>
    );
  }

  const vehicle = repair.carId;
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
                {vehicle?.make} {vehicle?.model}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {vehicle?.licensePlate} • VIN: {vehicle?.vin}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded ${statusColors[repair.status as RepairStatus] || "bg-gray-100 text-gray-800"}`}
            >
              {statusLabels[repair.status as RepairStatus] || repair.status}
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
              {repair.requestedDate && (
                <div>
                  <p className="text-xs text-neutral-500">Preferowany termin</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {new Date(repair.requestedDate).toLocaleDateString("pl-PL")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isMechanic && repair.status === "awaiting_approval" && (
          <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-xl border-2 border-amber-400 dark:border-amber-600 shadow-lg shadow-amber-100 dark:shadow-amber-900/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
                  Wymagana Twoja akceptacja
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                  Mechanik zgłosił zmiany wymagające Twojej zgody, zanim naprawa będzie kontynuowana:
                </p>

                <ul className="space-y-2 mb-5">
                  {repair.additionalIssues && (
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-amber-900 dark:text-amber-100">
                        <strong>Wykryto dodatkowe usterki</strong> — podczas przeglądu znaleziono nowe problemy wymagające naprawy.
                      </span>
                    </li>
                  )}
                  {repair.estimatedCost && (
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-amber-900 dark:text-amber-100">
                        <strong>Zmiana kosztów naprawy</strong> — szacowany koszt wynosi teraz{" "}
                        <span className="font-semibold">{Number(repair.estimatedCost).toFixed(2)} zł</span>.
                      </span>
                    </li>
                  )}
                  {!repair.additionalIssues && !repair.estimatedCost && (
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-amber-900 dark:text-amber-100">
                        Mechanik potrzebuje Twojej zgody na kontynuowanie prac. Sprawdź szczegóły poniżej.
                      </span>
                    </li>
                  )}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleStatusChange("in_progress")}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Akceptuję — kontynuuj naprawę
                  </button>
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    className="px-5 py-2.5 bg-white dark:bg-neutral-700 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium rounded-lg transition-colors"
                  >
                    Odrzuć — anuluj naprawę
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setEstimatedCost(isNaN(val) ? "" : String(Math.max(0, val)));
                    }}
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
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setFinalCost(isNaN(val) ? "" : String(Math.max(0, val)));
                    }}
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

        {!isMechanic && (repair.estimatedCost != null || repair.finalCost != null) && (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Koszty naprawy</h3>
            <div className="grid grid-cols-2 gap-4">
              {repair.estimatedCost != null && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Szacowany koszt</p>
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
                    {Number(repair.estimatedCost).toFixed(2)} zł
                  </p>
                </div>
              )}
              {repair.finalCost != null && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Finalny koszt</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {Number(repair.finalCost).toFixed(2)} zł
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!isMechanic && repair.mechanicNotes && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Notatki mechanika</h3>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">{repair.mechanicNotes}</p>
          </div>
        )}

        {!isMechanic && repair.additionalIssues && (
          <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-800/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Dodatkowe usterki wykryte podczas przeglądu
                </h3>
                <p className="text-orange-800 dark:text-orange-200 leading-relaxed">{repair.additionalIssues}</p>
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
              messages.map((msg: any) => {
                const isCurrentUser = msg.senderId === user?.id;
                return (
                  <div
                    key={msg._id || msg.id}
                    className={`p-3 rounded-lg ${
                      isCurrentUser ? "bg-blue-50 dark:bg-blue-900 ml-8" : "bg-neutral-50 dark:bg-neutral-700 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {isCurrentUser ? user?.name : (msg.senderRole === "mechanic" ? "Mechanik" : "Klient")}
                      </p>
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

