import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { Patient } from '../../types/clinical';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  AlertOctagon,
  FileCheck,
  Heart,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

export const PatientsCrmView: React.FC = () => {
  const { patients, registerPatient, appointments } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // New Patient Form
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('+52');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [gender, setGender] = useState<'F' | 'M' | 'Otro'>('F');
  const [bloodType, setBloodType] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [notes, setNotes] = useState('');
  const [consentSigned, setConsentSigned] = useState(true);

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.nationalId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || filteredPatients[0];

  const patientAppointments = appointments
    .filter((a) => a.patientId === selectedPatient?.id || a.patientPhone === selectedPatient?.phone)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const allergies = allergiesText
      ? allergiesText.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    const newPat = registerPatient({
      fullName,
      nationalId,
      phone,
      email,
      birthDate,
      gender,
      bloodType,
      allergies,
      notes,
      consentSigned,
      channelOrigin: 'recepcion',
    });

    setSelectedPatientId(newPat.id);
    setShowNewPatientModal(false);

    // Reset fields
    setFullName('');
    setNationalId('');
    setPhone('+52');
    setEmail('');
    setAllergiesText('');
    setNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Directorio de Pacientes & Expediente Clínico
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {patients.length} Registrados
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            CRM Operativo, Consentimientos & Antecedentes
          </h2>
        </div>

        <button
          onClick={() => setShowNewPatientModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>+ Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Two Column Layout: Directory + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Search & Patient List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, CURP o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
            />
          </div>

          {/* Patient Cards */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const hasAllergies = p.allergies.length > 0 && !p.allergies.includes('Ninguna conocida');

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-slate-900 dark:border-emerald-500 ring-2 ring-slate-900/10 dark:ring-emerald-500/30 shadow-sm'
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.fullName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.bloodType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {p.phone}
                    </span>
                    <span>{p.nationalId}</span>
                  </div>

                  {hasAllergies && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900 w-fit">
                      <AlertOctagon className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Alergias: {p.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Patient Clinical File */}
        <div className="lg:col-span-7">
          {selectedPatient ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors duration-200">
              {/* Header Profile */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedPatient.fullName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Grupo Sanguíneo: {selectedPatient.bloodType}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                    Documento ID: {selectedPatient.nationalId} • Origen: {selectedPatient.channelOrigin.toUpperCase()}
                  </p>
                </div>

                {selectedPatient.consentSigned ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Consentimiento Firmado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    Consentimiento Pendiente
                  </span>
                )}
              </div>

              {/* Allergy Warning Box (Clinical Safety) */}
              <div
                className={`p-4 rounded-xl border text-xs ${
                  selectedPatient.allergies.length > 0 && !selectedPatient.allergies.includes('Ninguna conocida')
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Alergias Conocidas y Reacciones Adversas:</span>
                </div>
                <p className="leading-relaxed">
                  {selectedPatient.allergies.length > 0
                    ? selectedPatient.allergies.join(' • ')
                    : 'Sin alergias medicamentosas o alimentarias reportadas.'}
                </p>
              </div>

              {/* Patient Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Teléfono WhatsApp (E.164)
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedPatient.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Correo Electrónico
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {selectedPatient.email || 'No registrado'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Fecha Nacimiento / Género
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedPatient.birthDate} ({selectedPatient.gender})
                  </span>
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Notas Clínicas y Antecedentes Médicos:
                </label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedPatient.notes || 'Sin notas registradas.'}
                </div>
              </div>

              {/* Appointment History */}
              <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Historial de Citas del Paciente ({patientAppointments.length}):</span>
                </h4>

                {patientAppointments.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 italic">No hay citas registradas para este paciente.</p>
                ) : (
                  <div className="space-y-2">
                    {patientAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                            <span>{apt.date}</span>
                            <span className="font-mono text-slate-600 dark:text-slate-400">
                              {apt.startTime} - {apt.endTime}
                            </span>
                            <span className="text-[10px] font-normal px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {apt.serviceName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Médico: {apt.doctorName} • Canal: {apt.channel}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            apt.status === 'completada'
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              : apt.status === 'en_consulta'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              Selecciona un paciente del directorio para consultar su expediente.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Alta de Paciente en NortIA Health
              </h3>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label htmlFor="pat-fullName" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nombre Completo:</label>
                <input
                  id="pat-fullName"
                  type="text"
                  placeholder="Ej. Laura Méndez Solís"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pat-nationalId" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">CURP / Cédula ID:</label>
                  <input
                    id="pat-nationalId"
                    type="text"
                    placeholder="CURP o identificación"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pat-phone" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Teléfono WhatsApp (E.164):</label>
                  <input
                    id="pat-phone"
                    type="tel"
                    placeholder="+5255..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="pat-birthDate" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Fecha Nac.:</label>
                  <input
                    id="pat-birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pat-gender" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Género:</label>
                  <select
                    id="pat-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pat-bloodType" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Grupo Sanguíneo:</label>
                  <select
                    id="pat-bloodType"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="pat-email" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Correo Electrónico:</label>
                <input
                  id="pat-email"
                  type="email"
                  placeholder="demo@example.invalid"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="pat-allergies" className="block text-slate-700 dark:text-slate-300 font-bold mb-1 text-rose-700 dark:text-rose-400">
                  Alergias (Separadas por comas):
                </label>
                <input
                  id="pat-allergies"
                  type="text"
                  placeholder="Ej. Penicilina, AINEs, Mariscos (o dejar en blanco)"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="pat-notes" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Antecedentes y Notas:</label>
                <textarea
                  id="pat-notes"
                  rows={2}
                  placeholder="Condiciones crónicas, cirugías previas o indicaciones de atención..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={consentSigned}
                  onChange={(e) => setConsentSigned(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="consentCheckbox" className="text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer">
                  El paciente firmó el <strong>Consentimiento Operativo y Aviso de Privacidad</strong>.
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Registrar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
