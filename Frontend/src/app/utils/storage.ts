// Ten plik będzie później zastąpiony przez prawdziwe API calls do Express + MongoDB

import { User, Vehicle, Repair, Message } from "../types";
import {
  mockUsers,
  mockVehicles,
  mockRepairs,
  mockMessages,
  getCurrentUser as getMockCurrentUser,
  setCurrentUser as setMockCurrentUser,
} from "../data/mockData";

// Tymczasowe przechowywanie w pamięci (nie persystuje po odświeżeniu)
let users = [...mockUsers];
let vehicles = [...mockVehicles];
let repairs = [...mockRepairs];
let messages = [...mockMessages];

// TODO: Zastąpić przez API calls
// GET /api/auth/current-user
export const getCurrentUser = (): User | null => {
  return getMockCurrentUser();
};

// POST /api/auth/login
export const setCurrentUser = (user: User | null) => {
  setMockCurrentUser(user);
};

// GET /api/users
export const getUsers = (): User[] => {
  return users;
};

// POST /api/users
export const saveUser = (user: User) => {
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
};

// GET /api/vehicles?userId=xxx
export const getVehicles = (userId?: string): Vehicle[] => {
  return userId ? vehicles.filter((v) => v.userId === userId) : vehicles;
};

// POST /api/vehicles
// PUT /api/vehicles/:id
export const saveVehicle = (vehicle: Vehicle) => {
  const index = vehicles.findIndex((v) => v.id === vehicle.id);
  if (index >= 0) {
    vehicles[index] = vehicle;
  } else {
    vehicles.push(vehicle);
  }
};

// GET /api/vehicles/:id
export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find((v) => v.id === id);
};

// GET /api/repairs?userId=xxx&mechanicId=xxx&status=xxx
export const getRepairs = (filters?: { userId?: string; mechanicId?: string; status?: string }): Repair[] => {
  let filtered = [...repairs];

  if (filters?.userId) {
    filtered = filtered.filter((r) => r.userId === filters.userId);
  }
  if (filters?.mechanicId) {
    filtered = filtered.filter((r) => r.mechanicId === filters.mechanicId);
  }
  if (filters?.status) {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// POST /api/repairs
// PUT /api/repairs/:id
export const saveRepair = (repair: Repair) => {
  const index = repairs.findIndex((r) => r.id === repair.id);
  if (index >= 0) {
    repairs[index] = repair;
  } else {
    repairs.push(repair);
  }
};

// GET /api/repairs/:id
export const getRepairById = (id: string): Repair | undefined => {
  return repairs.find((r) => r.id === id);
};

// GET /api/messages?repairId=xxx
export const getMessages = (repairId: string): Message[] => {
  return messages
    .filter((m) => m.repairId === repairId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// POST /api/messages
export const saveMessage = (message: Message) => {
  messages.push(message);
};

// Funkcja inicjalizująca - w produkcji nie będzie potrzebna
export const initializeDemoData = () => {
  // Dane są już załadowane z mockData
};
