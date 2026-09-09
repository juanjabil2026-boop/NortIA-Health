import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { ClinicService } from '../../types/clinical';
import {
  Sliders,
  Plus,
  Clock,
  DollarSign,
  CheckCircle2,
  Settings,
  Sparkles,
  Shield,
  Edit2,
  Save,
} from 'lucide-react';

export const ServicesConfigView: React.FC = () => {
  const { services, doctors, updateService, addService } = useClinical();
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<number>(30);
  const [editBuffer, setEditBuffer] = useState<number>(10);
  const [editPrice, setEditPrice] = useState<number>(600);

  // New Service Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newBuffer, setNewBuffer] = useState(10);
  const [newPrice, setNewPrice] = useState(700);
  const [newCategory, setNewCategory] = useState<'consulta' | 'especialidad' | 'procedimiento' | 'revision'>('consulta');
  const [newDoctorId, setNewDoctorId] = useState(doctors[0]?.id || '');

  // Operational Rules
  const [lockTtl, setLockTtl] = useState(300); // 5 min
  const [minNoticeHours, setMinNoticeHours] = useState(2);
  const [savedRulesBanner, setSavedRulesBanner] = useState(false);

  const startEdit = (service: ClinicService) => {
    setEditingServiceId(service.id);
    setEditDuration(service.durationMinutes);
    setEditBuffer(service.bufferMinutes);
    setEditPrice(service.price);
  };

  const saveEdit = (id: string) => {
    updateService(id, {
      durationMinutes: Number(editDuration),
      bufferMinutes: Number(editBuffer),
      price: Number(editPrice),
    });
    setEditingServiceId(null);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      name: newName,
      durationMinutes: Number(newDuration),
      bufferMinutes: Number(newBuffer),
      price: Number(newPrice),
      doctorIds: [newDoctorId],
      active: true,
      category: newCategory,
    });
    setShowAddModal(false);
    setNewName('');
  };

  const handleSaveOperationalRules = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedRulesBanner(true);
    setTimeout(() => setSavedRulesBanner(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Principio de Arquitectura: Configuración Sobre Código
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Cero Despliegues para Cambios Operativos
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Catálogo de Servicios Clínicos, Tiempos de Buffer & Reglas
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>+ Agregar Servicio Clínico</span>
        </button>
      </div>

      {savedRulesBanner && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Reglas operativas actualizadas y sincronizadas en el Core Engine.</span>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Servicios Clínicos Activos ({services.length})
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            El motor de agenda calcula disponibilidad sumando: Duración Cita + Buffer Limpieza
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Servicio Clínico</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Duración Consulta</th>
                <th className="py-3 px-4">Buffer / Desinfección</th>
                <th className="py-3 px-4">Tarifa (MXN)</th>
                <th className="py-3 px-4">Médicos Facultados</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {services.map((srv) => {
                const isEditing = editingServiceId === srv.id;
                const assignedDocs = doctors.filter((d) => srv.doctorIds.includes(d.id));

                return (
                  <tr key={srv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {srv.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {srv.category}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={10}
                            step={5}
                            value={editDuration}
                            onChange={(e) => setEditDuration(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                          />
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">min</span>
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {srv.durationMinutes} min
                        </span>
                      )}
                    </td>

                    {/* Buffer */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={editBuffer}
                            onChange={(e) => setEditBuffer(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                          />
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">min</span>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          +{srv.bufferMinutes} min
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">$</span>
                          <input
                            type="number"
                            min={0}
                            step={50}
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          ${srv.price} MXN
                        </span>
                      )}
                    </td>

                    {/* Doctors */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {assignedDocs.map((d) => (
                          <span
                            key={d.id}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(srv.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          Guardar
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(srv)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          Modificar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Clinical Rules Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Parámetros del Motor de Reserva & Locks Transaccionales
          </h3>
        </div>

        <form onSubmit={handleSaveOperationalRules} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label htmlFor="param-lock-ttl" className="font-bold text-slate-800 dark:text-slate-200 block">
              Tiempo de Expiración del Lock (TTL):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="param-lock-ttl"
                type="number"
                value={lockTtl}
                onChange={(e) => setLockTtl(Number(e.target.value))}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
              <span className="text-slate-600 dark:text-slate-400">segundos (5 min)</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Tiempo que un slot permanece reservado en WhatsApp antes de liberarse si no hay confirmación.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label htmlFor="param-min-notice" className="font-bold text-slate-800 dark:text-slate-200 block">
              Anticipación Mínima para Citas:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="param-min-notice"
                type="number"
                value={minNoticeHours}
                onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
              <span className="text-slate-600 dark:text-slate-400">horas previas</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Evita que pacientes agenden citas con menos de 2 horas de margen en el mismo día.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Políticas de Sede Roma Norte
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Horario: Lunes a Sábado de 08:00 a 19:00 hrs. Handoff a guardia médica después de las 19:00.
              </p>
            </div>
            <button
              type="submit"
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold text-[11px] hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-2xs self-start cursor-pointer"
            >
              Guardar Parámetros
            </button>
          </div>
        </form>
      </div>

      {/* MODAL: Agregar Servicio */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Nuevo Servicio en Catálogo Clínico
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="srv-name" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nombre del Servicio:</label>
                <input
                  id="srv-name"
                  type="text"
                  placeholder="Ej. Electrocardiograma con Interpretación"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="srv-duration" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Duración (min):</label>
                  <input
                    id="srv-duration"
                    type="number"
                    min={10}
                    step={5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="srv-buffer" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Buffer Limpieza (min):</label>
                  <input
                    id="srv-buffer"
                    type="number"
                    min={0}
                    step={5}
                    value={newBuffer}
                    onChange={(e) => setNewBuffer(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="srv-price" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Precio (MXN):</label>
                  <input
                    id="srv-price"
                    type="number"
                    min={0}
                    step={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="srv-category" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Categoría:</label>
                  <select
                    id="srv-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="especialidad">Especialidad</option>
                    <option value="procedimiento">Procedimiento</option>
                    <option value="revision">Revisión</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="srv-doctor" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Médico Asignado Principal:</label>
                <select
                  id="srv-doctor"
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Crear Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
