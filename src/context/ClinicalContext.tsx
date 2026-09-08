import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  ClinicService,
  Patient,
  Appointment,
  AppointmentLock,
  EscalationMessage,
  InventoryItem,
  InventoryBatch,
  InventoryMovement,
  AuditLogEntry,
  UserRole,
  AppointmentStatus,
} from '../types/clinical';
import {
  SEED_DOCTORS,
  SEED_SERVICES,
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_LOCKS,
  SEED_ESCALATIONS,
  SEED_INVENTORY_ITEMS,
  SEED_INVENTORY_BATCHES,
  SEED_INVENTORY_MOVEMENTS,
  SEED_AUDIT_LOGS,
} from '../services/clinicalStorage';

interface ClinicalContextType {
  // State
  doctors: Doctor[];
  services: ClinicService[];
  patients: Patient[];
  appointments: Appointment[];
  locks: AppointmentLock[];
  escalations: EscalationMessage[];
  inventoryItems: InventoryItem[];
  inventoryBatches: InventoryBatch[];
  inventoryMovements: InventoryMovement[];
  auditLogs: AuditLogEntry[];
  currentRole: UserRole;
  currentDate: string;
  selectedDoctorId: string; // 'all' or specific doctor id

  // Setters & Filters
  setCurrentRole: (role: UserRole) => void;
  setCurrentDate: (date: string) => void;
  setSelectedDoctorId: (id: string) => void;

  // Appointment & Lock Engine
  createLock: (
    doctorId: string,
    date: string,
    startTime: string,
    durationMinutes: number,
    patientName: string,
    patientPhone: string,
    serviceId: string
  ) => { success: boolean; lock?: AppointmentLock; error?: string };
  confirmLock: (lockId: string, notes?: string) => { success: boolean; appointment?: Appointment; error?: string };
  releaseLock: (lockId: string) => void;
  createManualAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  createScheduleBlock: (doctorId: string, date: string, startTime: string, endTime: string, reason: string) => void;

  // Patient Engine
  registerPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;

  // Inventory Engine (FEFO)
  recordInventoryMovement: (
    itemId: string,
    type: 'entrada' | 'salida_consulta' | 'merma' | 'ajuste_inventario',
    quantity: number,
    reason: string
  ) => { success: boolean; movement?: InventoryMovement; error?: string };
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'currentStock'>, initialBatch: { batchNumber: string; expirationDate: string; quantity: number; unitCost: number }) => void;

  // Service Config Engine
  updateService: (id: string, updates: Partial<ClinicService>) => void;
  addService: (service: Omit<ClinicService, 'id'>) => void;

  // Escalation & Handoff Engine
  resolveEscalation: (id: string, replyMessage?: string) => void;
  createEscalationFromChat: (
    patientName: string,
    patientPhone: string,
    reason: string,
    patientMessage: string,
    urgency: 'critica' | 'alta' | 'media'
  ) => EscalationMessage;

  // Reset to seed data
  resetDatabase: () => void;
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

export const ClinicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('nortia_doctors');
    return saved ? JSON.parse(saved) : SEED_DOCTORS;
  });

  const [services, setServices] = useState<ClinicService[]>(() => {
    const saved = localStorage.getItem('nortia_services');
    return saved ? JSON.parse(saved) : SEED_SERVICES;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('nortia_patients');
    return saved ? JSON.parse(saved) : SEED_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('nortia_appointments');
    return saved ? JSON.parse(saved) : SEED_APPOINTMENTS;
  });

  const [locks, setLocks] = useState<AppointmentLock[]>(() => {
    const saved = localStorage.getItem('nortia_locks');
    return saved ? JSON.parse(saved) : SEED_LOCKS;
  });

  const [escalations, setEscalations] = useState<EscalationMessage[]>(() => {
    const saved = localStorage.getItem('nortia_escalations');
    return saved ? JSON.parse(saved) : SEED_ESCALATIONS;
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('nortia_inv_items');
    return saved ? JSON.parse(saved) : SEED_INVENTORY_ITEMS;
  });

  const [inventoryBatches, setInventoryBatches] = useState<InventoryBatch[]>(() => {
    const saved = localStorage.getItem('nortia_inv_batches');
    return saved ? JSON.parse(saved) : SEED_INVENTORY_BATCHES;
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem('nortia_inv_movements');
    return saved ? JSON.parse(saved) : SEED_INVENTORY_MOVEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('nortia_audit_logs');
    return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('receptionist');
  const [currentDate, setCurrentDate] = useState<string>('2026-09-08');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nortia_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('nortia_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('nortia_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('nortia_locks', JSON.stringify(locks));
  }, [locks]);

  useEffect(() => {
    localStorage.setItem('nortia_escalations', JSON.stringify(escalations));
  }, [escalations]);

  useEffect(() => {
    localStorage.setItem('nortia_inv_items', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem('nortia_inv_batches', JSON.stringify(inventoryBatches));
  }, [inventoryBatches]);

  useEffect(() => {
    localStorage.setItem('nortia_inv_movements', JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem('nortia_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Periodic cleanup of expired locks (every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setLocks((prev) => prev.filter((lock) => lock.status === 'active' && lock.expiresAt > now));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const addAuditLog = (
    action: string,
    entity: AuditLogEntry['entity'],
    entityId: string,
    details: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      entity,
      entityId,
      details,
      performedBy:
        currentRole === 'receptionist'
          ? 'Coordinación de Recepción'
          : currentRole === 'doctor'
          ? 'Dr. Médico Tratante'
          : 'Administrador Clínico',
      role: currentRole,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper: calculate end time string
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Helper: check time overlap
  const isTimeOverlapping = (startA: string, endA: string, startB: string, endB: string): boolean => {
    return startA < endB && endA > startB;
  };

  // ==========================================
  // APPOINTMENT LOCK & ANTI-DOUBLE BOOKING
  // ==========================================
  const createLock = (
    doctorId: string,
    date: string,
    startTime: string,
    durationMinutes: number,
    patientName: string,
    patientPhone: string,
    serviceId: string
  ) => {
    const endTime = calculateEndTime(startTime, durationMinutes);
    const now = Date.now();

    // 1. Check existing confirmed appointments
    const hasAppointmentConflict = appointments.some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.status !== 'cancelada' &&
        isTimeOverlapping(startTime, endTime, apt.startTime, apt.endTime)
    );

    if (hasAppointmentConflict) {
      return {
        success: false,
        error: `Conflicto detectado: El doctor ya tiene una cita programada en el horario ${startTime} - ${endTime}.`,
      };
    }

    // 2. Check existing active locks (Anti-Double Booking)
    const hasLockConflict = locks.some(
      (lock) =>
        lock.doctorId === doctorId &&
        lock.date === date &&
        lock.status === 'active' &&
        lock.expiresAt > now &&
        isTimeOverlapping(startTime, endTime, lock.startTime, lock.endTime)
    );

    if (hasLockConflict) {
      return {
        success: false,
        error: `Horario bloqueado: Este espacio tiene una reserva temporal activa por otro paciente. Intente en 5 minutos o seleccione otro horario.`,
      };
    }

    // 3. Create lock with 300 seconds TTL (5 minutes)
    const newLock: AppointmentLock = {
      id: `lock-${Date.now()}`,
      doctorId,
      date,
      startTime,
      endTime,
      expiresAt: now + 300000,
      patientPhone,
      patientName,
      serviceId,
      status: 'active',
    };

    setLocks((prev) => [newLock, ...prev]);
    addAuditLog(
      'LOCK_TEMPORAL_CREADO',
      'lock',
      newLock.id,
      `Lock de 5 min creado para ${patientName} (${startTime} - ${endTime}) con ${doctors.find((d) => d.id === doctorId)?.name}.`
    );

    return { success: true, lock: newLock };
  };

  const confirmLock = (lockId: string, notes?: string) => {
    const targetLock = locks.find((l) => l.id === lockId && l.status === 'active');
    if (!targetLock || targetLock.expiresAt <= Date.now()) {
      return { success: false, error: 'El lock ha expirado o no existe. Vuelva a solicitar disponibilidad.' };
    }

    const doctor = doctors.find((d) => d.id === targetLock.doctorId);
    const service = services.find((s) => s.id === targetLock.serviceId);

    // Find or create patient
    let patient = patients.find((p) => p.phone === targetLock.patientPhone);
    if (!patient) {
      patient = {
        id: `pat-${Date.now()}`,
        fullName: targetLock.patientName,
        nationalId: `TEMP-${Date.now().toString().slice(-6)}`,
        phone: targetLock.patientPhone,
        birthDate: '1990-01-01',
        gender: 'Otro',
        bloodType: 'Desconocido',
        allergies: [],
        notes: 'Paciente registrado automáticamente desde canal de agendamiento.',
        consentSigned: false,
        createdAt: targetLock.date,
        channelOrigin: 'whatsapp',
      };
      setPatients((prev) => [patient!, ...prev]);
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      patientName: targetLock.patientName,
      patientPhone: targetLock.patientPhone,
      doctorId: targetLock.doctorId,
      doctorName: doctor ? doctor.name : 'Médico Asignado',
      serviceId: targetLock.serviceId,
      serviceName: service ? service.name : 'Consulta Médica',
      date: targetLock.date,
      startTime: targetLock.startTime,
      endTime: targetLock.endTime,
      durationMinutes: service ? service.durationMinutes : 30,
      status: 'confirmada',
      channel: 'whatsapp',
      lockId: targetLock.id,
      notes: notes || 'Cita convertida exitosamente desde reserva temporal con lock.',
      createdAt: new Date().toISOString(),
    };

    // Atomic update
    setAppointments((prev) => [newAppointment, ...prev]);
    setLocks((prev) => prev.map((l) => (l.id === lockId ? { ...l, status: 'converted' } : l)));

    addAuditLog(
      'CITA_CONFIRMADA_LOCK',
      'cita',
      newAppointment.id,
      `Lock ${lockId} convertido a cita confirmada para ${newAppointment.patientName} a las ${newAppointment.startTime}.`
    );

    return { success: true, appointment: newAppointment };
  };

  const releaseLock = (lockId: string) => {
    setLocks((prev) => prev.filter((l) => l.id !== lockId));
    addAuditLog('LOCK_LIBERADO', 'lock', lockId, `Lock temporal liberado manualmente o por caducidad.`);
  };

  const createManualAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    // Check conflicts
    const conflict = appointments.some(
      (apt) =>
        apt.doctorId === data.doctorId &&
        apt.date === data.date &&
        apt.status !== 'cancelada' &&
        isTimeOverlapping(data.startTime, data.endTime, apt.startTime, apt.endTime)
    );

    if (conflict) {
      return { success: false, error: 'Conflicto de horario: El médico ya tiene una cita en ese intervalo.' };
    }

    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);
    addAuditLog(
      'CITA_CREADA_MANUAL',
      'cita',
      newApt.id,
      `Cita creada manualmente por ${currentRole} para ${newApt.patientName} (${newApt.startTime}).`
    );

    return { success: true, appointment: newApt };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addAuditLog(
      'ESTADO_CITA_ACTUALIZADO',
      'cita',
      id,
      `Estado de la cita cambiado a ${status.toUpperCase()}.`
    );
  };

  const createScheduleBlock = (
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    reason: string
  ) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    const blockApt: Appointment = {
      id: `block-${Date.now()}`,
      patientId: 'system-block',
      patientName: `Bloqueo: ${reason}`,
      patientPhone: 'N/A',
      doctorId,
      doctorName: doctor ? doctor.name : 'Todos los médicos',
      serviceId: 'none',
      serviceName: 'Bloqueo de Agenda',
      date,
      startTime,
      endTime,
      durationMinutes: 60,
      status: 'bloqueado',
      channel: 'recepcion',
      notes: reason,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [blockApt, ...prev]);
    addAuditLog('AGENDA_BLOQUEADA', 'cita', blockApt.id, `Horario ${startTime}-${endTime} bloqueado por: ${reason}`);
  };

  // ==========================================
  // PATIENT CRM
  // ==========================================
  const registerPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPat: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPatients((prev) => [newPat, ...prev]);
    addAuditLog('PACIENTE_REGISTRADO', 'paciente', newPat.id, `Nuevo paciente registrado: ${newPat.fullName}`);
    return newPat;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addAuditLog('PACIENTE_ACTUALIZADO', 'paciente', id, `Datos del paciente actualizados.`);
  };

  // ==========================================
  // INVENTORY & FEFO ENGINE
  // ==========================================
  const recordInventoryMovement = (
    itemId: string,
    type: 'entrada' | 'salida_consulta' | 'merma' | 'ajuste_inventario',
    quantity: number,
    reason: string
  ) => {
    if (!Number.isFinite(quantity) || quantity <= 0) return { success: false, error: 'La cantidad debe ser mayor que cero.' };
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item) return { success: false, error: 'Insumo no encontrado.' };

    const previousStock = item.currentStock;
    let newStock = previousStock;

    if (type === 'entrada') {
      newStock += quantity;
      // create or update batch
      const newBatch: InventoryBatch = {
        id: `bat-${Date.now()}`,
        itemId,
        batchNumber: `LOT-IN-${Date.now().toString().slice(-4)}`,
        expirationDate: '2028-01-01',
        quantity,
        unitCost: 25,
      };
      setInventoryBatches((prev) => [...prev, newBatch]);
    } else {
      if (previousStock < quantity) {
        return {
          success: false,
          error: `Stock insuficiente: Se solicitaron ${quantity} ${item.unit} pero solo hay ${previousStock} disponibles.`,
        };
      }
      newStock -= quantity;

      // FEFO Logic: deduct from batch with earliest expiration date
      let remainingToDeduct = quantity;
      setInventoryBatches((prevBatches) => {
        // Sort active batches for this item by expiration date ascending (FEFO)
        const itemBatches = prevBatches
          .filter((b) => b.itemId === itemId && b.quantity > 0)
          .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));

        const updatedBatches = prevBatches.map((batch) => ({ ...batch }));

        for (const batch of itemBatches) {
          if (remainingToDeduct <= 0) break;
          const targetIndex = updatedBatches.findIndex((b) => b.id === batch.id);
          if (targetIndex !== -1) {
            if (batch.quantity >= remainingToDeduct) {
              updatedBatches[targetIndex].quantity -= remainingToDeduct;
              remainingToDeduct = 0;
            } else {
              remainingToDeduct -= batch.quantity;
              updatedBatches[targetIndex].quantity = 0;
            }
          }
        }
        return updatedBatches;
      });
    }

    // Update item stock
    setInventoryItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, currentStock: newStock } : i))
    );

    // Append to immutable ledger
    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId,
      itemName: item.name,
      type,
      quantity,
      batchNumber: 'FEFO_AUTO',
      reason,
      performer:
        currentRole === 'receptionist'
          ? 'Coordinación de Recepción & Farmacia'
          : currentRole === 'doctor'
          ? 'Dra. Elena López'
          : 'Administrador',
      previousStock,
      newStock,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setInventoryMovements((prev) => [movement, ...prev]);
    addAuditLog(
      'MOVIMIENTO_INVENTARIO_FEFO',
      'inventario',
      movement.id,
      `${type.toUpperCase()}: ${quantity} ${item.unit} de ${item.name}. Motivo: ${reason}`
    );

    return { success: true, movement };
  };

  const addInventoryItem = (
    itemData: Omit<InventoryItem, 'id' | 'currentStock'>,
    initialBatch: { batchNumber: string; expirationDate: string; quantity: number; unitCost: number }
  ) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      currentStock: initialBatch.quantity,
    };
    const newBatch: InventoryBatch = {
      id: `bat-${Date.now()}`,
      itemId: newItem.id,
      ...initialBatch,
    };

    setInventoryItems((prev) => [newItem, ...prev]);
    setInventoryBatches((prev) => [...prev, newBatch]);

    addAuditLog('NUEVO_INSUMO_REGISTRADO', 'inventario', newItem.id, `Nuevo producto en catálogo: ${newItem.name}`);
  };

  // ==========================================
  // CLINICAL SERVICES CONFIGURATION
  // ==========================================
  const updateService = (id: string, updates: Partial<ClinicService>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addAuditLog('SERVICIO_MODIFICADO', 'servicio', id, `Configuración del servicio clínico modificada.`);
  };

  const addService = (serviceData: Omit<ClinicService, 'id'>) => {
    const newSrv: ClinicService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newSrv]);
    addAuditLog('SERVICIO_CREADO', 'servicio', newSrv.id, `Nuevo servicio agregado al catálogo: ${newSrv.name}`);
  };

  // ==========================================
  // ESCALATION & HANDOFF (RECEPTION INBOX)
  // ==========================================
  const resolveEscalation = (id: string, replyMessage?: string) => {
    setEscalations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'resuelto' } : item))
    );
    addAuditLog(
      'ESCALAMIENTO_RESUELTO',
      'escalamiento',
      id,
      `Personal de recepción atendió el caso clínico. ${replyMessage ? `Respuesta enviada: "${replyMessage}"` : 'Bot reactivado.'}`
    );
  };

  const createEscalationFromChat = (
    patientName: string,
    patientPhone: string,
    reason: string,
    patientMessage: string,
    urgency: 'critica' | 'alta' | 'media'
  ) => {
    const newEscalation: EscalationMessage = {
      id: `esc-${Date.now()}`,
      conversationId: `conv-${patientPhone.slice(-6)}`,
      patientName,
      patientPhone,
      urgency,
      reason,
      lastPatientMessage: patientMessage,
      aiSummary: `El paciente presenta consulta que sobrepasa el marco administrativo de la IA. Guardrail activado: Solicitud de intervención para ${patientName}.`,
      aiSuggestedAction:
        urgency === 'critica'
          ? 'Contactar al médico tratante y llamar al paciente de inmediato.'
          : 'Revisar expediente clínico y contestar directamente por WhatsApp.',
      status: 'pendiente',
      assignedTo: 'Coordinación de Recepción',
      timestamp: 'Justo ahora',
    };

    setEscalations((prev) => [newEscalation, ...prev]);
    addAuditLog(
      'ESCALAMIENTO_AUTOMATICO_ACTIVADO',
      'escalamiento',
      newEscalation.id,
      `Guardrail clínico disparado por IA para paciente ${patientName}. Urgencia: ${urgency.toUpperCase()}.`
    );

    return newEscalation;
  };

  const resetDatabase = () => {
    Object.keys(localStorage).filter((key) => key.startsWith('nortia_')).forEach((key) => localStorage.removeItem(key));
    setServices(SEED_SERVICES);
    setPatients(SEED_PATIENTS);
    setAppointments(SEED_APPOINTMENTS);
    setLocks(SEED_LOCKS);
    setEscalations(SEED_ESCALATIONS);
    setInventoryItems(SEED_INVENTORY_ITEMS);
    setInventoryBatches(SEED_INVENTORY_BATCHES);
    setInventoryMovements(SEED_INVENTORY_MOVEMENTS);
    setAuditLogs(SEED_AUDIT_LOGS);
  };

  return (
    <ClinicalContext.Provider
      value={{
        doctors,
        services,
        patients,
        appointments,
        locks,
        escalations,
        inventoryItems,
        inventoryBatches,
        inventoryMovements,
        auditLogs,
        currentRole,
        currentDate,
        selectedDoctorId,
        setCurrentRole,
        setCurrentDate,
        setSelectedDoctorId,
        createLock,
        confirmLock,
        releaseLock,
        createManualAppointment,
        updateAppointmentStatus,
        createScheduleBlock,
        registerPatient,
        updatePatient,
        recordInventoryMovement,
        addInventoryItem,
        updateService,
        addService,
        resolveEscalation,
        createEscalationFromChat,
        resetDatabase,
      }}
    >
      {children}
    </ClinicalContext.Provider>
  );
};

export const useClinical = () => {
  const context = useContext(ClinicalContext);
  if (!context) {
    throw new Error('useClinical must be used within a ClinicalProvider');
  }
  return context;
};
