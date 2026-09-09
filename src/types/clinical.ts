export type ClinicalTab =
  | 'agenda'
  | 'whatsapp'
  | 'inbox'
  | 'patients'
  | 'inventory'
  | 'services'
  | 'audit';

export type UserRole = 'receptionist' | 'doctor' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  room: string;
  color: string;
  avatarInitials: string;
  active: boolean;
}

export interface ClinicService {
  id: string;
  name: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  doctorIds: string[];
  active: boolean;
  category: 'consulta' | 'especialidad' | 'procedimiento' | 'revision';
}

export interface Patient {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string; // E.164
  email?: string;
  birthDate: string;
  gender: 'F' | 'M' | 'Otro';
  bloodType: string;
  allergies: string[];
  notes: string;
  consentSigned: boolean;
  createdAt: string;
  channelOrigin: 'whatsapp' | 'recepcion' | 'doctoralia';
}

export type AppointmentStatus =
  | 'confirmada'
  | 'en_espera'
  | 'en_consulta'
  | 'completada'
  | 'cancelada'
  | 'bloqueado';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  channel: 'whatsapp' | 'recepcion' | 'doctoralia';
  lockId?: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentLock {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  expiresAt: number; // timestamp ms
  patientPhone: string;
  patientName: string;
  serviceId: string;
  status: 'active' | 'converted' | 'expired';
}

export interface EscalationMessage {
  id: string;
  conversationId: string;
  patientName: string;
  patientPhone: string;
  urgency: 'critica' | 'alta' | 'media';
  reason: string;
  lastPatientMessage: string;
  aiSummary: string;
  aiSuggestedAction: string;
  status: 'pendiente' | 'en_atencion' | 'resuelto';
  assignedTo: string;
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'medicamento' | 'insumo' | 'anestesia' | 'descartable';
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
  requiresPrescription: boolean;
  active: boolean;
}

export interface InventoryBatch {
  id: string;
  itemId: string;
  batchNumber: string;
  expirationDate: string; // YYYY-MM-DD
  quantity: number;
  unitCost: number;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'entrada' | 'salida_consulta' | 'merma' | 'ajuste_inventario';
  quantity: number;
  batchNumber: string;
  reason: string;
  performer: string;
  previousStock: number;
  newStock: number;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: 'cita' | 'lock' | 'paciente' | 'servicio' | 'inventario' | 'escalamiento' | 'ia_tool';
  entityId: string;
  details: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
}
