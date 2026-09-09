import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { EscalationMessage } from '../../types/clinical';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  User,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const EscalationsInboxView: React.FC = () => {
  const { escalations, resolveEscalation } = useClinical();
  const [selectedEscalationId, setSelectedEscalationId] = useState<string>(
    escalations[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'resuelto'>('pendiente');
  const [replyText, setReplyText] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredEscalations = escalations.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const selectedEscalation = escalations.find((e) => e.id === selectedEscalationId) || filteredEscalations[0];

  const handleSelectEscalation = (id: string) => {
    setSelectedEscalationId(id);
    setShowMobileDetail(true);
  };

  const handleSendResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalation) return;
    resolveEscalation(selectedEscalation.id, replyText);
    setReplyText('');
  };

  const getUrgencyBadge = (urgency: EscalationMessage['urgency']) => {
    switch (urgency) {
      case 'critica':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
            Urgencia Crítica
          </span>
        );
      case 'alta':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
            Prioridad Alta
          </span>
        );
      case 'media':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            Prioridad Media
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-tight">
              Protocolo de Intervención Humana
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 tabular-nums">
              {escalations.filter((e) => e.status === 'pendiente').length} Casos Pendientes
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Bandeja de Intervención y Escalamientos
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setFilterStatus('pendiente')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'pendiente'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Pendientes ({escalations.filter((e) => e.status === 'pendiente').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('resuelto')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'resuelto'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Resueltos ({escalations.filter((e) => e.status === 'resuelto').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todos ({escalations.length})
          </button>
        </div>
      </div>

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: List of Escalation Tickets */}
        <div
          className={`lg:col-span-5 space-y-2.5 ${
            showMobileDetail ? 'hidden lg:block' : 'block'
          }`}
        >
          {filteredEscalations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs shadow-xs">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Bandeja al día</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">No hay alertas de escalamiento en esta categoría.</p>
            </div>
          ) : (
            filteredEscalations.map((item) => {
              const isSelected = selectedEscalation?.id === item.id;
              const isResolved = item.status === 'resuelto';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectEscalation(item.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-slate-800 dark:border-emerald-500 ring-1 ring-slate-800/20 dark:ring-emerald-500/30 shadow-xs'
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                      <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span className="truncate">{item.patientName}</span>
                    </div>
                    <div className="shrink-0">{getUrgencyBadge(item.urgency)}</div>
                  </div>

                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1 text-xs">
                    {item.reason}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 italic mb-2 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                    "{item.lastPatientMessage}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                      {item.timestamp}
                    </span>
                    <span
                      className={`font-semibold uppercase tracking-tight ${
                        isResolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isResolved ? 'Resuelto' : 'Requiere Intervención'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Case Details & Resolution Panel */}
        <div
          className={`lg:col-span-7 ${
            showMobileDetail ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedEscalation ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors duration-200">
              {/* Mobile Back Button */}
              <div className="lg:hidden pb-2 border-b border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMobileDetail(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  ← Volver a la lista de casos
                </button>
              </div>

              {/* Header Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedEscalation.patientName}
                    </h3>
                    {getUrgencyBadge(selectedEscalation.urgency)}
                  </div>
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1 tabular-nums">
                    Teléfono: {selectedEscalation.patientPhone} • Asignado a: {selectedEscalation.assignedTo}
                  </p>
                </div>

                {selectedEscalation.status === 'resuelto' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Caso Atendido y Resuelto
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => resolveEscalation(selectedEscalation.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors shadow-2xs cursor-pointer"
                  >
                    Marcar como Atendido
                  </button>
                )}
              </div>

              {/* Section 1: Raw Message from Interlocutor */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  1. Mensaje recibido en canal de mensajería:
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans italic">
                  "{selectedEscalation.lastPatientMessage}"
                </div>
              </div>

              {/* Section 2: AI Structured Clinical Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                  <span>2. Resumen Estructurado del Protocolo:</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedEscalation.aiSummary}
                </div>
              </div>

              {/* Section 3: Recommended Action */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide block">
                  3. Acción sugerida para el personal:
                </label>
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                  {selectedEscalation.aiSuggestedAction}
                </div>
              </div>

              {/* Section 4: Human Response Composer */}
              {selectedEscalation.status === 'pendiente' && (
                <form
                  onSubmit={handleSendResolution}
                  className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs"
                >
                  <label htmlFor="escalation-reply-textarea" className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                    4. Redactar respuesta de recepción médica al interlocutor:
                  </label>
                  <textarea
                    id="escalation-reply-textarea"
                    rows={3}
                    placeholder="Estimado/a, nos comunicamos de recepción médica. Tras revisar su mensaje con el médico tratante, le indicamos lo siguiente..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    required
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Al enviar, el caso se registrará como resuelto en la bitácora clínica.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-semibold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400 dark:text-white shrink-0" />
                      <span>Enviar y Resolver Caso</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400 text-xs">
              Selecciona un caso de la lista para ver el expediente y responder.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
