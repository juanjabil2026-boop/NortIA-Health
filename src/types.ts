export type TabType = 'agenda' | 'whatsapp' | 'inbox' | 'patients' | 'inventory' | 'services' | 'audit';

export type AudienceFilter = 'all' | 'executive' | 'technical' | 'clinical';

export interface KeyMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
  trend?: string;
}

export interface StrategicPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  audience: AudienceFilter[] | string[];
  category?: 'business' | 'tech' | 'clinical';
  keyTakeaway?: string;
}

export interface ModuleItem {
  id: string;
  code: string;
  name: string;
  category: 'core' | 'operations' | 'platform';
  description: string;
  keyFeatures: string[];
  inMVP: boolean;
  priority?: 'MVP' | 'Fase 2' | 'Fase 3' | 'Fase 4';
  scope?: string;
  dependencies?: string[];
  techSpec?: string;
  clinicalImpact?: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  deliverables: string[];
  highlight?: boolean;
  name?: string;
  estimatedWeeks?: string;
  modulesIncluded?: string[];
  primaryDeliverable?: string;
  status?: 'Inmediato' | 'Siguiente' | 'Futuro';
}

export interface ADRItem {
  code: string;
  title: string;
  rationale: string;
  impact: string;
  id?: string;
  context?: string;
  decision?: string;
  consequences?: string;
  status?: 'Aprobado' | 'En revisión' | 'Propuesto';
}

export interface RiskItem {
  id: string;
  risk: string;
  severity: 'critical' | 'high' | 'medium';
  mitigation: string;
  category?: 'Seguridad & Legal' | 'Negocio & Alcance' | 'Técnico';
  impact?: 'Crítico' | 'Alto' | 'Medio';
}

export interface OperationalTicket {
  id: string;
  code: string;
  week: number;
  title: string;
  duration: string; // e.g. "4-6 horas"
  role: 'Tech Lead' | 'Full-stack builder' | 'Automation engineer' | 'Clinical advisor';
  description: string;
  acceptanceCriteria: string[];
  vibeCodingPrompt: string;
  sqlSnippet?: string;
  apiEndpoint?: string;
  completed?: boolean;
}

export interface WeekPlan {
  weekNumber: number;
  focus: string;
  deliverable: string;
  badge: string;
  description: string;
  tickets: OperationalTicket[];
}

export interface StackTool {
  name: string;
  role: string;
  operationalControl: string;
  category: 'code' | 'ai' | 'backend' | 'frontend' | 'automation' | 'gateway' | 'security';
  envVars: string[];
  status: 'Requerido' | 'Configurado' | 'En Proceso';
}

export interface TeamMember {
  role: string;
  capacity: string;
  nameOrAssignee: string;
  responsibility: string;
  weeklyHours: string;
}

export interface RiskOperational {
  risk: string;
  level: 'Alto' | 'Medio/alto' | 'Medio';
  mitigation: string;
  solutionInApp: string;
}

export interface ClinicService {
  id: string;
  name: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  active: boolean;
  color: string;
}

export interface AppointmentSlot {
  id: string;
  time: string;
  patientName: string;
  patientPhone: string;
  service: string;
  doctor: string;
  status: 'confirmada' | 'en_atencion' | 'pendiente_confirmar' | 'bloqueado';
  channel: 'WhatsApp (Evolution API)' | 'Panel Recepción' | 'Doctoralia (Reconciliado)';
}

export interface EscalationInboxItem {
  id: string;
  patientName: string;
  patientPhone: string;
  reason: string;
  urgency: 'alta' | 'media' | 'baja';
  summaryFromIA: string;
  receivedAt: string;
  resolved: boolean;
}
