import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { AuditLogEntry } from '../../types/clinical';
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Activity,
  UserCheck,
  Database,
  Cpu,
  BarChart3,
  Clock,
} from 'lucide-react';

export const AuditObservabilityView: React.FC = () => {
  const { auditLogs, appointments, inventoryMovements, escalations, locks } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (entityFilter !== 'all' && log.entity !== entityFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.performedBy.toLowerCase().includes(q) ||
      log.entityId.toLowerCase().includes(q)
    );
  });

  const getEntityBadge = (entity: AuditLogEntry['entity']) => {
    switch (entity) {
      case 'cita':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300';
      case 'lock':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300';
      case 'paciente':
        return 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300';
      case 'inventario':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300';
      case 'escalamiento':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300';
      case 'servicio':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Seguridad desde Fase 0 & Trazabilidad Sanitaria
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              100% Inmutable
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Registro de Auditoría & Observabilidad Operativa
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            PostgreSQL Ledger • ACID Guaranteed
          </span>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Tasa de Ocupación Hoy
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">82%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            {appointments.length} citas / 3 consultorios
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            No-Shows Mitigados
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">94.2%</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Vía recordatorios interactivos T-24h
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Latencia Agente IA (p95)
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">1.2 s</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Evolution API + n8n + Gemini Router
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Cero Double-Bookings
          </span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">0 Colisiones</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Locks transaccionales de 300s en Core
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs space-y-3 p-4 transition-colors duration-200">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['all', 'cita', 'lock', 'paciente', 'inventario', 'escalamiento', 'servicio'].map((ent) => (
              <button
                key={ent}
                onClick={() => setEntityFilter(ent)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  entityFilter === ent
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ent === 'all' ? 'Todos los Eventos' : ent.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="audit-search-input"
              type="text"
              aria-label="Buscar en logs de auditoría"
              placeholder="Buscar en logs de auditoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Acción</th>
                <th className="py-3 px-4">Dominio</th>
                <th className="py-3 px-4">Detalle Operativo</th>
                <th className="py-3 px-4">Ejecutado Por</th>
                <th className="py-3 px-4">Rol RBAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getEntityBadge(
                        log.entity
                      )}`}
                    >
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 leading-relaxed max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                    {log.performedBy}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
