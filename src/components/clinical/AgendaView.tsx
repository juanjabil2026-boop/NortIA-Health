import React, { useState, useEffect } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { Appointment, AppointmentStatus } from '../../types/clinical';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Plus,
  Lock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  XCircle,
  Search,
  Check,
  Building,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const AgendaView: React.FC = () => {
  const {
    doctors,
    services,
    patients,
    appointments,
    locks,
    currentDate,
    selectedDoctorId,
    setSelectedDoctorId,
    confirmLock,
    releaseLock,
    createManualAppointment,
    updateAppointmentStatus,
    createScheduleBlock,
  } = useClinical();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewAptModal, setShowNewAptModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Form states for New Appointment
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [startTime, setStartTime] = useState('11:00');
  const [aptNotes, setAptNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Form states for Block
  const [blockDoctorId, setBlockDoctorId] = useState(doctors[0]?.id || '');
  const [blockStart, setBlockStart] = useState('14:00');
  const [blockEnd, setBlockEnd] = useState('15:00');
  const [blockReason, setBlockReason] = useState('Cirugía programada');

  // Filter appointments by current date and doctor
  const dayAppointments = appointments
    .filter((apt) => apt.date === currentDate)
    .filter((apt) => (selectedDoctorId === 'all' ? true : apt.doctorId === selectedDoctorId))
    .filter((apt) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        apt.patientName.toLowerCase().includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.serviceName.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q)
      );
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Active locks for today
  const activeLocks = locks.filter(
    (l) => l.date === currentDate && l.status === 'active' && l.expiresAt > Date.now()
  );

  // Countdown timer trigger every second
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const doc = doctors.find((d) => d.id === doctorId);
    const srv = services.find((s) => s.id === serviceId);
    if (!doc || !srv) {
      setFormError('Doctor o servicio no válido.');
      return;
    }

    let finalPatientName = '';
    let finalPatientPhone = '';
    let finalPatientId = patientId;

    if (isNewPatient) {
      if (!newPatientName.trim() || !newPatientPhone.trim()) {
        setFormError('Por favor complete nombre y teléfono del nuevo paciente.');
        return;
      }
      finalPatientName = newPatientName.trim();
      finalPatientPhone = newPatientPhone.trim();
      finalPatientId = `pat-manual-${Date.now()}`;
    } else {
      const p = patients.find((pat) => pat.id === patientId);
      if (!p) {
        setFormError('Seleccione un paciente existente o marque nuevo paciente.');
        return;
      }
      finalPatientName = p.fullName;
      finalPatientPhone = p.phone;
    }

    // Calculate end time
    const [h, m] = startTime.split(':').map(Number);
    const totalM = h * 60 + m + srv.durationMinutes;
    const endTime = `${String(Math.floor(totalM / 60)).padStart(2, '0')}:${String(totalM % 60).padStart(2, '0')}`;

    const res = createManualAppointment({
      patientId: finalPatientId,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
      doctorId: doc.id,
      doctorName: doc.name,
      serviceId: srv.id,
      serviceName: srv.name,
      date: currentDate,
      startTime,
      endTime,
      durationMinutes: srv.durationMinutes,
      status: 'confirmada',
      channel: 'recepcion',
      notes: aptNotes,
    });

    if (!res.success) {
      setFormError(res.error || 'Error al agendar cita.');
      return;
    }

    setShowNewAptModal(false);
    setAptNotes('');
    setNewPatientName('');
    setNewPatientPhone('');
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    createScheduleBlock(blockDoctorId, currentDate, blockStart, blockEnd, blockReason);
    setShowBlockModal(false);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'en_consulta':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <PlayCircle className="w-3 h-3" />
            En Consulta
          </span>
        );
      case 'en_espera':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            En Sala de Espera
          </span>
        );
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <CheckCircle2 className="w-3 h-3" />
            Confirmada
          </span>
        );
      case 'completada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Check className="w-3 h-3" />
            Finalizada
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
      case 'bloqueado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Lock className="w-3 h-3" />
            Horario Bloqueado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Unified Top Controls: Row 1 (Title + Date + Actions), Row 2 (Doctor Filters + Search) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3 transition-colors duration-200">
        {/* Row 1: Agenda Title, Date Context & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Agenda Médica del Día
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              •
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {dayAppointments.length} {dayAppointments.length === 1 ? 'cita programada' : 'citas programadas'}
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentDate}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-block-schedule"
              type="button"
              onClick={() => setShowBlockModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Bloquear Horario</span>
            </button>

            <button
              id="btn-new-appointment"
              type="button"
              onClick={() => setShowNewAptModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
              <span>Agendar Cita en Recepción</span>
            </button>
          </div>
        </div>

        {/* Row 2: Doctor Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Doctor Filter Pills - Single line without breaking */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            <button
              type="button"
              onClick={() => setSelectedDoctorId('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedDoctorId === 'all'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos los médicos ({appointments.filter((a) => a.date === currentDate).length} citas)
            </button>
            {doctors.map((doc) => {
              const docAppointmentsCount = appointments.filter(
                (a) => a.date === currentDate && a.doctorId === doc.id
              ).length;
              const isSelected = selectedDoctorId === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: doc.color }}
                  />
                  <span>{doc.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    ({docAppointmentsCount} citas)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="agenda-search-input"
              type="text"
              aria-label="Buscar paciente, servicio o médico en la agenda"
              placeholder="Buscar paciente, servicio o médico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Active Locks Warning Banner (Anti-Double Booking Engine) */}
      {activeLocks.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>
                Motor Anti-Double Booking: {activeLocks.length} {activeLocks.length === 1 ? 'reserva activa' : 'reservas activas'} con bloqueo temporal
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium hidden sm:inline">
              Horario protegido contra sobreventa multicanal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeLocks.map((lock) => {
              const secondsLeft = Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000));
              const mins = Math.floor(secondsLeft / 60);
              const secs = secondsLeft % 60;
              const doc = doctors.find((d) => d.id === lock.doctorId);

              return (
                <div
                  key={lock.id}
                  className="p-2.5 bg-white dark:bg-slate-800/90 rounded-lg border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                      <span className="truncate">{lock.patientName}</span>
                      <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 shrink-0">
                        {lock.startTime} - {lock.endTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {doc?.name} • {lock.patientPhone}
                    </p>
                    <p className="text-[10px] font-mono tabular-nums text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                      Expira en: {mins}:{secs < 10 ? `0${secs}` : secs} min
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => confirmLock(lock.id)}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => releaseLock(lock.id)}
                      className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] cursor-pointer"
                    >
                      Liberar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointments List / Timeline Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        {dayAppointments.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Calendar className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No hay citas programadas para esta vista</p>
            <p className="mt-1">Selecciona otra fecha o añade una cita con el botón de recepción.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3.5">Horario</th>
                  <th className="py-2.5 px-3.5">Paciente & Contacto</th>
                  <th className="py-2.5 px-3.5">Servicio Clínico</th>
                  <th className="py-2.5 px-3.5">Médico & Consultorio</th>
                  <th className="py-2.5 px-3.5">Canal</th>
                  <th className="py-2.5 px-3.5">Estado</th>
                  <th className="py-2.5 px-3.5 text-right">Acciones de Recepción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dayAppointments.map((apt) => {
                  const doc = doctors.find((d) => d.id === apt.doctorId);
                  const isBlocked = apt.status === 'bloqueado';

                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                        isBlocked ? 'bg-slate-50/60 dark:bg-slate-800/30' : ''
                      }`}
                    >
                      {/* Time with tabular numbers */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {apt.startTime} – {apt.endTime}
                        </span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {apt.durationMinutes} min
                        </span>
                      </td>

                      {/* Patient & Contact with Guardian distinction if present */}
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{apt.patientName}</p>
                        {apt.notes && apt.notes.toLowerCase().includes('tutor') && (
                          <span className="inline-block text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800 mt-0.5 font-medium">
                            Con Tutor/Responsable
                          </span>
                        )}
                        {apt.patientPhone !== 'N/A' && (
                          <p className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                            {apt.patientPhone}
                          </p>
                        )}
                      </td>

                      {/* Clinical Service */}
                      <td className="py-3 px-3.5 max-w-[200px]">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block truncate" title={apt.serviceName}>
                          {apt.serviceName}
                        </span>
                        {apt.notes && (
                          <span
                            className="block text-[10px] text-slate-500 dark:text-slate-400 truncate"
                            title={apt.notes}
                          >
                            {apt.notes}
                          </span>
                        )}
                      </td>

                      {/* Doctor & Room */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: doc?.color || '#64748b' }}
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">{apt.doctorName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{doc?.room}</p>
                          </div>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            apt.channel === 'whatsapp'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : apt.channel === 'doctoralia'
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {apt.channel === 'whatsapp' && 'WhatsApp'}
                          {apt.channel === 'recepcion' && 'Recepción'}
                          {apt.channel === 'doctoralia' && 'Doctoralia'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        {!isBlocked ? (
                          <select
                            value={apt.status}
                            aria-label={`Cambiar estado de cita para ${apt.patientName}`}
                            onChange={(e) =>
                              updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
                            }
                            className="text-[11px] font-semibold py-1 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-hidden focus:ring-1 focus:ring-slate-400 cursor-pointer"
                          >
                            <option value="confirmada">Confirmada</option>
                            <option value="en_espera">Llegó a Recepción</option>
                            <option value="en_consulta">En Consulta</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelar Cita</option>
                          </select>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelada')}
                            className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:underline font-bold cursor-pointer"
                          >
                            Liberar Bloqueo
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Nueva Cita Manual */}
      {showNewAptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Agendar Cita en Recepción
              </h3>
              <button
                onClick={() => setShowNewAptModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="apt-patient-field" className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold mb-1">
                  <span>Paciente:</span>
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(!isNewPatient)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-normal text-[11px] cursor-pointer"
                  >
                    {isNewPatient ? 'Seleccionar existente' : '+ Registrar nuevo'}
                  </button>
                </label>

                {isNewPatient ? (
                  <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                      id="apt-new-patient-name"
                      type="text"
                      placeholder="Nombre completo..."
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                    <input
                      id="apt-new-patient-phone"
                      type="tel"
                      placeholder="Teléfono WhatsApp (+52...)"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                ) : (
                  <select
                    id="apt-patient-field"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.phone})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apt-doctor-field" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Médico:</label>
                  <select
                    id="apt-doctor-field"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="apt-start-time" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Hora Inicio:</label>
                  <input
                    id="apt-start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apt-service-field" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Servicio Clínico:</label>
                <select
                  id="apt-service-field"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} min • ${s.price} MXN)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="apt-notes-field" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Notas de la Cita:</label>
                <input
                  id="apt-notes-field"
                  type="text"
                  placeholder="Motivo de consulta o indicaciones..."
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAptModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Confirmar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Bloqueo de Horario */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Bloquear Espacio en Agenda
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="block-doctor-field" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Médico:</label>
                <select
                  id="block-doctor-field"
                  value={blockDoctorId}
                  onChange={(e) => setBlockDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="block-start-time" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Desde:</label>
                  <input
                    id="block-start-time"
                    type="time"
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="block-end-time" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Hasta:</label>
                  <input
                    id="block-end-time"
                    type="time"
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="block-reason-field" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Motivo del Bloqueo:</label>
                <input
                  id="block-reason-field"
                  type="text"
                  placeholder="Ej. Cirugía en hospital, comida, reunión de dirección..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 cursor-pointer"
                >
                  Aplicar Bloqueo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
