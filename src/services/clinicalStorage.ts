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
} from '../types/clinical';

export const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dra. Elena López',
    specialty: 'Medicina General & Familiar',
    room: 'Consultorio 1',
    color: '#059669', // Emerald
    avatarInitials: 'EL',
    active: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Carlos Ramírez',
    specialty: 'Traumatología & Ortopedia',
    room: 'Consultorio 2',
    color: '#4f46e5', // Indigo
    avatarInitials: 'CR',
    active: true,
  },
  {
    id: 'doc-3',
    name: 'Dra. Patricia Solís',
    specialty: 'Pediatría & Puericultura',
    room: 'Consultorio 3',
    color: '#0284c7', // Sky
    avatarInitials: 'PS',
    active: true,
  },
];

export const SEED_SERVICES: ClinicService[] = [
  {
    id: 'srv-1',
    name: 'Consulta Médica General',
    durationMinutes: 30,
    bufferMinutes: 10,
    price: 600,
    doctorIds: ['doc-1'],
    active: true,
    category: 'consulta',
  },
  {
    id: 'srv-2',
    name: 'Valoración Traumatológica Especializada',
    durationMinutes: 45,
    bufferMinutes: 15,
    price: 1200,
    doctorIds: ['doc-2'],
    active: true,
    category: 'especialidad',
  },
  {
    id: 'srv-3',
    name: 'Consulta Pediátrica Integral',
    durationMinutes: 40,
    bufferMinutes: 10,
    price: 900,
    doctorIds: ['doc-3'],
    active: true,
    category: 'consulta',
  },
  {
    id: 'srv-4',
    name: 'Curación & Sutura Menor',
    durationMinutes: 30,
    bufferMinutes: 15,
    price: 750,
    doctorIds: ['doc-1', 'doc-2'],
    active: true,
    category: 'procedimiento',
  },
  {
    id: 'srv-5',
    name: 'Revisión y Retiro de Puntos',
    durationMinutes: 20,
    bufferMinutes: 5,
    price: 400,
    doctorIds: ['doc-1', 'doc-2'],
    active: true,
    category: 'revision',
  },
];

export const SEED_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Paciente Demo 01',
    nationalId: 'DEMO-SIN-IDENTIFICACION',
    phone: '+1555010100',
    email: 'demo@example.invalid',
    birthDate: '1989-04-12',
    gender: 'F',
    bloodType: 'O+',
    allergies: ['Penicilina', 'AINEs (Ácido acetilsalicílico)'],
    notes: 'Paciente con antecedente de asma leve controlada. Prefiere citas por la mañana.',
    consentSigned: true,
    createdAt: '2026-08-15',
    channelOrigin: 'whatsapp',
  },
  {
    id: 'pat-2',
    fullName: 'Paciente Demo 02',
    nationalId: 'DEMO-SIN-IDENTIFICACION',
    phone: '+1555010101',
    email: 'demo@example.invalid',
    birthDate: '1978-11-03',
    gender: 'M',
    bloodType: 'A+',
    allergies: ['Ninguna conocida'],
    notes: 'Post-quirúrgico de menisco derecho hace 6 meses. Seguimiento de rehabilitación.',
    consentSigned: true,
    createdAt: '2026-08-20',
    channelOrigin: 'whatsapp',
  },
  {
    id: 'pat-3',
    fullName: 'Paciente Demo 03',
    nationalId: 'DEMO-SIN-IDENTIFICACION',
    phone: '+1555010102',
    email: 'demo@example.invalid',
    birthDate: '1995-02-18',
    gender: 'F',
    bloodType: 'O-',
    allergies: ['Sulfamidas'],
    notes: 'Control metabólico y perfil lipídico.',
    consentSigned: true,
    createdAt: '2026-08-25',
    channelOrigin: 'recepcion',
  },
  {
    id: 'pat-4',
    fullName: 'Paciente Demo 04 (Tutor Demo)',
    nationalId: 'DEMO-SIN-IDENTIFICACION',
    phone: '+1555010103',
    email: 'demo@example.invalid',
    birthDate: '2021-06-14',
    gender: 'M',
    bloodType: 'B+',
    allergies: ['Proteína de leche de vaca (superada)'],
    notes: 'Revisión periódica de 5 años y esquema de vacunación.',
    consentSigned: true,
    createdAt: '2026-08-29',
    channelOrigin: 'whatsapp',
  },
  {
    id: 'pat-5',
    fullName: 'Paciente Demo 05',
    nationalId: 'DEMO-SIN-IDENTIFICACION',
    phone: '+1555010104',
    email: 'demo@example.invalid',
    birthDate: '1962-09-14',
    gender: 'M',
    bloodType: 'AB+',
    allergies: ['Mariscos', 'Ciprofloxacino'],
    notes: 'Hipertensión arterial en tratamiento con losartán 50mg.',
    consentSigned: true,
    createdAt: '2026-09-01',
    channelOrigin: 'doctoralia',
  },
];

// Today is 2026-09-08
export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: 'Paciente Demo 01',
    patientPhone: '+1555010100',
    doctorId: 'doc-1',
    doctorName: 'Dra. Elena López',
    serviceId: 'srv-1',
    serviceName: 'Consulta Médica General',
    date: '2026-09-08',
    startTime: '09:00',
    endTime: '09:30',
    durationMinutes: 30,
    status: 'en_consulta',
    channel: 'whatsapp',
    notes: 'Cita originada por bot WhatsApp con lock temporal.',
    createdAt: '2026-09-07T18:20:00Z',
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: 'Paciente Demo 02',
    patientPhone: '+1555010101',
    doctorId: 'doc-2',
    doctorName: 'Dr. Carlos Ramírez',
    serviceId: 'srv-2',
    serviceName: 'Valoración Traumatológica Especializada',
    date: '2026-09-08',
    startTime: '09:40',
    endTime: '10:25',
    durationMinutes: 45,
    status: 'confirmada',
    channel: 'whatsapp',
    notes: 'Recordatorio T-24h enviado y confirmado por WhatsApp.',
    createdAt: '2026-09-06T14:10:00Z',
  },
  {
    id: 'apt-103',
    patientId: 'pat-3',
    patientName: 'Paciente Demo 03',
    patientPhone: '+1555010102',
    doctorId: 'doc-1',
    doctorName: 'Dra. Elena López',
    serviceId: 'srv-5',
    serviceName: 'Revisión y Retiro de Puntos',
    date: '2026-09-08',
    startTime: '10:45',
    endTime: '11:05',
    durationMinutes: 20,
    status: 'en_espera',
    channel: 'recepcion',
    notes: 'Paciente llegó a sala de espera. Notificada la doctora.',
    createdAt: '2026-09-08T08:30:00Z',
  },
  {
    id: 'apt-104',
    patientId: 'system',
    patientName: 'Bloqueo: Comité Quirúrgico',
    patientPhone: 'N/A',
    doctorId: 'doc-2',
    doctorName: 'Dr. Carlos Ramírez',
    serviceId: 'none',
    serviceName: 'Bloqueo de Agenda',
    date: '2026-09-08',
    startTime: '11:30',
    endTime: '12:30',
    durationMinutes: 60,
    status: 'bloqueado',
    channel: 'recepcion',
    notes: 'Horario reservado por personal de recepción por reunión clínica.',
    createdAt: '2026-09-08T07:00:00Z',
  },
  {
    id: 'apt-105',
    patientId: 'pat-4',
    patientName: 'Paciente Demo 04',
    patientPhone: '+1555010103',
    doctorId: 'doc-3',
    doctorName: 'Dra. Patricia Solís',
    serviceId: 'srv-3',
    serviceName: 'Consulta Pediátrica Integral',
    date: '2026-09-08',
    startTime: '13:00',
    endTime: '13:40',
    durationMinutes: 40,
    status: 'confirmada',
    channel: 'whatsapp',
    notes: 'Tutor confirmó asistencia.',
    createdAt: '2026-09-07T11:00:00Z',
  },
  {
    id: 'apt-106',
    patientId: 'pat-5',
    patientName: 'Paciente Demo 05',
    patientPhone: '+1555010104',
    doctorId: 'doc-1',
    doctorName: 'Dra. Elena López',
    serviceId: 'srv-1',
    serviceName: 'Consulta Médica General',
    date: '2026-09-08',
    startTime: '16:00',
    endTime: '16:30',
    durationMinutes: 30,
    status: 'confirmada',
    channel: 'doctoralia',
    notes: 'Cita importada y reconciliada desde canal externo Doctoralia.',
    createdAt: '2026-09-07T19:45:00Z',
  },
];

export const SEED_LOCKS: AppointmentLock[] = [
  {
    id: 'lock-8821',
    doctorId: 'doc-1',
    date: '2026-09-08',
    startTime: '14:30',
    endTime: '15:00',
    expiresAt: Date.now() + 180000, // 3 min remaining
    patientPhone: '+1555010105',
    patientName: 'Paciente Demo 06',
    serviceId: 'srv-1',
    status: 'active',
  },
];

export const SEED_ESCALATIONS: EscalationMessage[] = [
  {
    id: 'esc-01',
    conversationId: 'conv-553321',
    patientName: 'Paciente Demo 07',
    patientPhone: '+1555010103',
    urgency: 'critica',
    reason: 'Consulta sobre dosis de antibiótico post-operatorio y dolor agudo',
    lastPatientMessage:
      'Buenas tardes, anoche me dieron de alta de la cirugía pero siento una molestia fuerte. ¿Puedo duplicar la dosis del ketorolaco o tomar amoxicilina?',
    aiSummary:
      'Paciente post-quirúrgica consulta sobre duplicación de analgésico y automedicación antibiótica ante dolor agudo. Guardrail de IA activado: Prohibición de prescripción. Bot pausado de inmediato.',
    aiSuggestedAction:
      'Contactar urgentemente al Dr. Carlos Ramírez (médico tratante) y llamar por teléfono a la paciente para valorar atención en urgencias.',
    status: 'pendiente',
    assignedTo: 'Coordinación de Recepción',
    timestamp: 'Hace 6 minutos',
  },
  {
    id: 'esc-02',
    conversationId: 'conv-556672',
    patientName: 'Paciente Demo 08',
    patientPhone: '+1555010106',
    urgency: 'media',
    reason: 'Solicitud de consulta fuera del horario regular de la clínica',
    lastPatientMessage:
      'Buenas tardes, salgo del trabajo hasta las 8:00 PM. ¿Sería posible que la Dra. López me atienda hoy a las 8:30 PM de favor?',
    aiSummary:
      'Paciente solicita cita nocturna fuera de la jornada regular (08:00 a 19:00 hrs). La IA explicó el horario y solicitó autorización de coordinación de recepción para consulta extraordinaria.',
    aiSuggestedAction:
      'Consultar disponibilidad de guardia de la Dra. López o reprogramar para el sábado a las 09:00 AM.',
    status: 'pendiente',
    assignedTo: 'Coordinación de Recepción',
    timestamp: 'Hace 24 minutos',
  },
];

export const SEED_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    code: 'MED-KET-30',
    name: 'Ketorolaco Trometamina 30mg/ml Ampolleta',
    category: 'medicamento',
    currentStock: 35,
    minStock: 20,
    unit: 'ampolletas',
    location: 'Gabinete Médico A-2',
    requiresPrescription: true,
    active: true,
  },
  {
    id: 'inv-2',
    code: 'INS-SUT-30',
    name: 'Sutura Nylon Monofilamento 3-0 con Aguja',
    category: 'insumo',
    currentStock: 12,
    minStock: 15, // Low stock!
    unit: 'sobres',
    location: 'Carro de Curaciones Sala 1',
    requiresPrescription: false,
    active: true,
  },
  {
    id: 'inv-3',
    code: 'MED-LID-2P',
    name: 'Lidocaína Simple al 2% Frasco Ámpula 50ml',
    category: 'anestesia',
    currentStock: 8,
    minStock: 5,
    unit: 'frascos',
    location: 'Refrigerador Clínico Ref-1',
    requiresPrescription: true,
    active: true,
  },
  {
    id: 'inv-4',
    code: 'DES-GUA-75',
    name: 'Guantes Quirúrgicos Estériles Calibre 7.5',
    category: 'descartable',
    currentStock: 120,
    minStock: 50,
    unit: 'pares',
    location: 'Almacén Central Estante 4',
    requiresPrescription: false,
    active: true,
  },
  {
    id: 'inv-5',
    code: 'MED-PAR-50',
    name: 'Paracetamol 500mg Comprimidos Caja x20',
    category: 'medicamento',
    currentStock: 48,
    minStock: 30,
    unit: 'cajas',
    location: 'Farmacia Dispensador B-1',
    requiresPrescription: false,
    active: true,
  },
  {
    id: 'inv-6',
    code: 'INS-VEN-10',
    name: 'Venda Elástica de Compresión 10cm x 5m',
    category: 'insumo',
    currentStock: 18,
    minStock: 10,
    unit: 'piezas',
    location: 'Carro de Traumatología Sala 2',
    requiresPrescription: false,
    active: true,
  },
];

export const SEED_INVENTORY_BATCHES: InventoryBatch[] = [
  {
    id: 'bat-1',
    itemId: 'inv-1',
    batchNumber: 'LOT-KT-2026A',
    expirationDate: '2026-10-15', // Expires in ~1 month (Priority FEFO)
    quantity: 15,
    unitCost: 45.0,
  },
  {
    id: 'bat-2',
    itemId: 'inv-1',
    batchNumber: 'LOT-KT-2027B',
    expirationDate: '2027-04-20',
    quantity: 20,
    unitCost: 48.5,
  },
  {
    id: 'bat-3',
    itemId: 'inv-2',
    batchNumber: 'LOT-NYL-2609',
    expirationDate: '2026-09-30', // Very soon!
    quantity: 12,
    unitCost: 65.0,
  },
  {
    id: 'bat-4',
    itemId: 'inv-3',
    batchNumber: 'LOT-LID-2701',
    expirationDate: '2027-08-10',
    quantity: 8,
    unitCost: 110.0,
  },
  {
    id: 'bat-5',
    itemId: 'inv-4',
    batchNumber: 'LOT-GLV-2802',
    expirationDate: '2028-02-14',
    quantity: 120,
    unitCost: 18.0,
  },
  {
    id: 'bat-6',
    itemId: 'inv-5',
    batchNumber: 'LOT-PAR-2612',
    expirationDate: '2026-12-31',
    quantity: 48,
    unitCost: 32.0,
  },
  {
    id: 'bat-7',
    itemId: 'inv-6',
    batchNumber: 'LOT-VND-2710',
    expirationDate: '2027-10-15',
    quantity: 18,
    unitCost: 22.0,
  },
];

export const SEED_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    itemId: 'inv-1',
    itemName: 'Ketorolaco Trometamina 30mg/ml Ampolleta',
    type: 'salida_consulta',
    quantity: 1,
    batchNumber: 'LOT-KT-2026A',
    reason: 'Aplicación intramuscular a paciente en Consulta #101 por lumbalgia aguda',
    performer: 'Dra. Elena López',
    previousStock: 36,
    newStock: 35,
    timestamp: '2026-09-08 09:25:00',
  },
  {
    id: 'mov-2',
    itemId: 'inv-2',
    itemName: 'Sutura Nylon Monofilamento 3-0 con Aguja',
    type: 'salida_consulta',
    quantity: 2,
    batchNumber: 'LOT-NYL-2609',
    reason: 'Sutura de herida cortante en mano derecha',
    performer: 'Dr. Carlos Ramírez',
    previousStock: 14,
    newStock: 12,
    timestamp: '2026-09-07 16:40:00',
  },
  {
    id: 'mov-3',
    itemId: 'inv-4',
    itemName: 'Guantes Quirúrgicos Estériles Calibre 7.5',
    type: 'entrada',
    quantity: 50,
    batchNumber: 'LOT-GLV-2802',
    reason: 'Reabastecimiento de insumos descartables Factura #B-4921',
    performer: 'Coordinación de Recepción & Farmacia',
    previousStock: 70,
    newStock: 120,
    timestamp: '2026-09-05 11:15:00',
  },
  {
    id: 'mov-4',
    itemId: 'inv-3',
    itemName: 'Lidocaína Simple al 2% Frasco Ámpula 50ml',
    type: 'merma',
    quantity: 1,
    batchNumber: 'LOT-LID-2508',
    reason: 'Frasco caducado retirado según protocolo de farmacia sanitaria',
    performer: 'Coordinación de Recepción & Farmacia',
    previousStock: 9,
    newStock: 8,
    timestamp: '2026-09-01 08:30:00',
  },
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    action: 'CITA_CONFIRMADA',
    entity: 'cita',
    entityId: 'apt-101',
    details: 'Paciente Paciente Demo 01 confirmó horario 09:00 mediante WhatsApp tras lock temporal.',
    performedBy: 'Evolution API / Bot WhatsApp',
    role: 'receptionist',
    timestamp: '2026-09-07 18:22:15',
  },
  {
    id: 'aud-2',
    action: 'LOCK_TEMPORAL_CREADO',
    entity: 'lock',
    entityId: 'lock-8821',
    details: 'Lock temporal de 300 segundos creado para slot 14:30 con Dra. López.',
    performedBy: 'NortIA Core Engine',
    role: 'receptionist',
    timestamp: '2026-09-08 09:32:00',
  },
  {
    id: 'aud-3',
    action: 'ESCALAMIENTO_HUMANO_DISPARADO',
    entity: 'escalamiento',
    entityId: 'esc-01',
    details: 'Guardrail clínico activado: Duda médica sobre ketorolaco y amoxicilina. Bot silenciado.',
    performedBy: 'Agente IA NortIA',
    role: 'admin',
    timestamp: '2026-09-08 09:30:10',
  },
  {
    id: 'aud-4',
    action: 'MOVIMIENTO_INVENTARIO_FEFO',
    entity: 'inventario',
    entityId: 'mov-1',
    details: 'Salida de 1 ampolleta Ketorolaco lote LOT-KT-2026A (caducidad más próxima).',
    performedBy: 'Dra. Elena López',
    role: 'doctor',
    timestamp: '2026-09-08 09:25:00',
  },
  {
    id: 'aud-5',
    action: 'BLOQUEO_AGENDA_MANUAL',
    entity: 'cita',
    entityId: 'apt-104',
    details: 'Bloqueo manual de 11:30 a 12:30 para Dr. Ramírez por comité quirúrgico.',
    performedBy: 'Personal de Recepción',
    role: 'receptionist',
    timestamp: '2026-09-08 07:00:00',
  },
];
