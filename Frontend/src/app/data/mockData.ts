import { User, Vehicle, Repair, Message } from "../types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    role: "client",
    phone: "+48 123 456 789",
  },
  {
    id: "user-2",
    name: "Anna Nowak",
    email: "anna.nowak@example.com",
    role: "client",
    phone: "+48 234 567 890",
  },
  {
    id: "mechanic-1",
    name: "Piotr Mechanik",
    email: "piotr@warsztat.pl",
    role: "mechanic",
    phone: "+48 987 654 321",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    userId: "user-1",
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    vin: "JT2BF18K8X0123456",
    licensePlate: "WA 12345",
    mileage: 85000,
  },
  {
    id: "vehicle-2",
    userId: "user-1",
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    vin: "WVWZZZ1KZCW123456",
    licensePlate: "KR 98765",
    mileage: 45000,
  },
  {
    id: "vehicle-3",
    userId: "user-2",
    brand: "BMW",
    model: "320i",
    year: 2020,
    vin: "WBA8E3C50K7L12345",
    licensePlate: "GD 55555",
    mileage: 62000,
  },
];

export const mockRepairs: Repair[] = [
  {
    id: "repair-1",
    vehicleId: "vehicle-1",
    userId: "user-1",
    mechanicId: "mechanic-1",
    status: "in_progress",
    description: "Dziwny hałas przy hamowaniu, szczególnie przy wyższych prędkościach",
    requestedDate: "2026-04-15",
    scheduledDate: "2026-04-15",
    estimatedCost: 800,
    mechanicNotes: "Wymiana klocków hamulcowych z przodu, tarcze również wymagają regeneracji",
    createdAt: "2026-04-08T10:30:00Z",
    updatedAt: "2026-04-10T14:20:00Z",
  },
  {
    id: "repair-2",
    vehicleId: "vehicle-2",
    userId: "user-1",
    mechanicId: "mechanic-1",
    status: "awaiting_approval",
    description: "Wymiana oleju i filtrów - przegląd okresowy",
    requestedDate: "2026-04-12",
    scheduledDate: "2026-04-12",
    estimatedCost: 350,
    mechanicNotes: "Standardowa wymiana oleju i filtrów wykonana",
    additionalIssues: "Podczas przeglądu wykryto zużyte tarcze sprzęgła. Wymaga wymiany w najbliższym czasie (szacunkowy koszt: 1500 zł)",
    createdAt: "2026-04-05T09:15:00Z",
    updatedAt: "2026-04-11T11:45:00Z",
  },
  {
    id: "repair-3",
    vehicleId: "vehicle-1",
    userId: "user-1",
    mechanicId: "mechanic-1",
    status: "completed",
    description: "Wymiana opon na letnie",
    requestedDate: "2026-03-20",
    scheduledDate: "2026-03-20",
    completedDate: "2026-03-20",
    estimatedCost: 150,
    finalCost: 150,
    mechanicNotes: "Wymiana kompletu opon na letnie, wyważenie kół",
    createdAt: "2026-03-15T14:20:00Z",
    updatedAt: "2026-03-20T16:30:00Z",
  },
  {
    id: "repair-4",
    vehicleId: "vehicle-3",
    userId: "user-2",
    status: "pending",
    description: "Kontrolka airbag świeci się na tablicy rozdzielczej",
    requestedDate: "2026-04-16",
    createdAt: "2026-04-11T08:00:00Z",
    updatedAt: "2026-04-11T08:00:00Z",
  },
  {
    id: "repair-5",
    vehicleId: "vehicle-2",
    userId: "user-1",
    mechanicId: "mechanic-1",
    status: "ready",
    description: "Klimatyzacja nie chłodzi",
    requestedDate: "2026-04-10",
    scheduledDate: "2026-04-10",
    estimatedCost: 450,
    finalCost: 420,
    mechanicNotes: "Uzupełnienie czynnika chłodzącego, sprawdzenie szczelności układu",
    createdAt: "2026-04-06T11:30:00Z",
    updatedAt: "2026-04-11T09:15:00Z",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    repairId: "repair-1",
    senderId: "mechanic-1",
    senderRole: "mechanic",
    content: "Dzień dobry, pojazd przyjęty do warsztatu. Rozpoczynam diagnostykę układu hamulcowego.",
    timestamp: "2026-04-10T14:20:00Z",
  },
  {
    id: "msg-2",
    repairId: "repair-1",
    senderId: "user-1",
    senderRole: "client",
    content: "Dziękuję za informację. Czy będzie gotowe jeszcze dziś?",
    timestamp: "2026-04-10T15:30:00Z",
  },
  {
    id: "msg-3",
    repairId: "repair-1",
    senderId: "mechanic-1",
    senderRole: "mechanic",
    content: "Naprawa powinna być zakończona jutro przed południem. Dam znać jak tylko będzie gotowe.",
    timestamp: "2026-04-10T15:45:00Z",
  },
  {
    id: "msg-4",
    repairId: "repair-2",
    senderId: "mechanic-1",
    senderRole: "mechanic",
    content: "Wykryłem dodatkowe usterki - proszę sprawdzić sekcję 'Dodatkowe usterki' i potwierdzić czy kontynuować naprawę.",
    timestamp: "2026-04-11T11:45:00Z",
  },
  {
    id: "msg-5",
    repairId: "repair-5",
    senderId: "user-1",
    senderRole: "client",
    content: "O której mogę odebrać samochód?",
    timestamp: "2026-04-11T09:20:00Z",
  },
  {
    id: "msg-6",
    repairId: "repair-5",
    senderId: "mechanic-1",
    senderRole: "mechanic",
    content: "Samochód gotowy do odbioru. Można odebrać w godzinach 8:00-18:00.",
    timestamp: "2026-04-11T09:25:00Z",
  },
];

// Symulacja stanu aplikacji (w produkcji będzie to API)
let currentUser: User | null = null;

export const getCurrentUser = () => currentUser;
export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};
