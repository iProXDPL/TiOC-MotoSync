export type UserRole = "client" | "mechanic";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
}

export type RepairStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "awaiting_approval"
  | "ready"
  | "completed"
  | "cancelled";

export interface Repair {
  id: string;
  vehicleId: string;
  userId: string;
  mechanicId?: string;
  status: RepairStatus;
  description: string;
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedCost?: number;
  finalCost?: number;
  mechanicNotes?: string;
  additionalIssues?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  repairId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
}
