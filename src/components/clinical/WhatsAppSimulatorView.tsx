import React, { useState, useRef, useEffect } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { NortIALogoIcon } from '../common/NortIALogo';
import {
  Send,
  Bot,
  User,
  ShieldAlert,
  Lock,
  CheckCheck,
  Smartphone,
  Terminal,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  toolCall?: {
    name: string;
    payload: any;
    result: any;
  };
  isEscalation?: boolean;
}

export const WhatsAppSimulatorView: React.FC = () => {
  const {
    doctors,
    services,
    currentDate,
    createLock,
    confirmLock,
    createEscalationFromChat,
    locks,
    appointments,
  } = useClinical();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: '¡Hola! Te comunicas con la recepción digital de la clínica (NortIA Health). ¿En qué podemos ayudarte hoy? Puedo coordinar tu cita médica, verificar horarios o asistirte con dudas frecuentes.',
      timestamp: '09:00',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [interlocutorName, setInterlocutorName] = useState('Paciente Demo 01');
  const [currentPatientName, setCurrentPatientName] = useState('Paciente Demo 01');
  const [currentPatientPhone, setCurrentPatientPhone] = useState('+1555010100');
  const [activeChatLockId, setActiveChatLockId] = useState<string | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([
    '[Gateway] Conexión de mensajería iniciada con firma de webhook.',
    '[Orquestador] Sesión de atención administrativa inicializada sin retención de datos sensibles.',
    '[NortIA Core] Sesión lista para contacto Paciente Demo 01 (+1555010100).',
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addTrace = (log: string) => {
    setTraceLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${log}`,
      ...prev.slice(0, 15),
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    addTrace(`[Mensajería] Mensaje recibido de ${currentPatientPhone}: "${text}"`);
    addTrace(`[Enrutador] Procesando solicitud con reglas de recepción médica.`);

    setTimeout(() => {
      processAgentResponse(text);
      setIsTyping(false);
    }, 900);
  };

  const processAgentResponse = (userText: string) => {
    const lower = userText.toLowerCase();

    // 1. Guardrail Check: Medical prescription, acute pain, bleeding, clinical doubts
    if (
      lower.includes('dolor') ||
      lower.includes('sangr') ||
      lower.includes('receta') ||
      lower.includes('medicamento') ||
      lower.includes('dosis') ||
      lower.includes('pildora') ||
      lower.includes('antibiotico') ||
      lower.includes('pastilla')
    ) {
      addTrace(`[GUARDRAIL CLINICO] DISPARADO: Detección de consulta médica o fármacos.`);
      addTrace(`[NortIA Core] Derivación obligatoria a personal de salud. Pausando bot.`);

      createEscalationFromChat(
        currentPatientName,
        currentPatientPhone,
        'Consulta de síntomas agudos o medicación vía WhatsApp',
        userText,
        'critica'
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Entiendo tu situación, ${interlocutorName}. Por protocolos de seguridad clínica y marco legal de atención, este canal no emite diagnósticos, no receta medicamentos ni modifica tratamientos farmacológicos.

He transferido inmediatamente tu consulta al equipo de recepción y al médico tratante. Te contactaremos directamente por este medio a la brevedad. Si se trata de una urgencia médica, por favor acude al servicio de urgencias más cercano.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalation: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
      addTrace(`[Inbox Recepción] Caso registrado en bandeja de escalamientos con prioridad crítica.`);
      return;
    }

    // 2. User confirms existing lock
    if (
      (lower.includes('si') || lower.includes('confirmo') || lower.includes('de acuerdo') || lower.includes('listo')) &&
      activeChatLockId
    ) {
      addTrace(`[Core API] Invocando confirmación de reserva (lockId=${activeChatLockId})`);
      const res = confirmLock(activeChatLockId, 'Confirmado por WhatsApp');

      if (res.success && res.appointment) {
        addTrace(`[Base de Datos] Cita #${res.appointment.id} registrada y confirmada exitosamente.`);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Cita confirmada para ${currentPatientName}. Los datos registrados en sistema son:

📅 Fecha: ${currentDate}
⏰ Horario: ${res.appointment.startTime} - ${res.appointment.endTime} hrs
👨‍⚕️ Especialista: ${res.appointment.doctorName}
🏥 Servicio: ${res.appointment.serviceName}
📍 Sede: Consultorio 1 • Roma Norte

Recepción le espera 10 minutos antes de la hora acordada. Para cualquier cambio o consulta previa, estamos a tu disposición por este canal.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCall: {
            name: 'confirm_appointment_lock',
            payload: { lockId: activeChatLockId },
            result: { appointmentId: res.appointment.id, status: 'confirmada' },
          },
        };
        setActiveChatLockId(null);
        setMessages((prev) => [...prev, aiMsg]);
        return;
      } else {
        const errorMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `El bloqueo temporal de horario ha expirado o el espacio ya no está disponible. ¿Deseas consultar otros horarios con el especialista?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setActiveChatLockId(null);
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }
    }

    // 3. User requests a specific slot or general booking
    if (lower.includes('cita') || lower.includes('agendar') || lower.includes('horario') || lower.includes('consulta') || lower.includes('dra. lópez') || lower.includes('elena') || lower.includes('14:30') || lower.includes('15:00')) {
      const doc = doctors[0]; // Dra. Elena López
      const srv = services[0]; // Consulta General (30 min)

      let targetTime = '14:30';
      if (lower.includes('15:00')) targetTime = '15:00';
      if (lower.includes('16:00')) targetTime = '16:00';

      addTrace(`[Disponibilidad] Verificando agenda para ${doc.name} a las ${targetTime} hrs`);

      // Attempt lock in Core engine
      const lockRes = createLock(
        doc.id,
        currentDate,
        targetTime,
        srv.durationMinutes,
        currentPatientName,
        currentPatientPhone,
        srv.id
      );

      if (lockRes.success && lockRes.lock) {
        setActiveChatLockId(lockRes.lock.id);
        addTrace(`[NortIA Core] Bloqueo temporal generado (#${lockRes.lock.id}). Vigencia: 5 min.`);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Disponibilidad encontrada con ${doc.name} para hoy a las ${targetTime} hrs (${srv.name}, duración estimada de ${srv.durationMinutes} min, arancel $${srv.price} MXN).

El horario queda reservado temporalmente por 5 minutos para evitar cruce con otros canales.

¿Deseas confirmar la cita en este horario? (Escribe "Sí, confirmo" para asegurar el espacio).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCall: {
            name: 'create_temporary_lock',
            payload: { doctorId: doc.id, time: targetTime, duration: 30 },
            result: { lockId: lockRes.lock.id, expiresAt: '300s' },
          },
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Double booking collision avoided!
        addTrace(`[Conflicto Evitado] Horario ${targetTime} ocupado en multiagenda.`);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `El horario de las ${targetTime} hrs ya no se encuentra disponible debido a una reserva previa en curso.

Para ${doc.name} tengo los siguientes horarios libres hoy:
• 15:30 hrs
• 16:30 hrs
• 17:15 hrs

¿Te es conveniente alguno de estos horarios?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCall: {
            name: 'create_temporary_lock',
            payload: { doctorId: doc.id, time: targetTime },
            result: { error: lockRes.error, status: 409 },
          },
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
      return;
    }

    // Default polite response
    const defaultMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Con gusto te apoyo con la coordinación administrativa. Puedes consultar disponibilidad médica, aranceles vigentes o agendar cita con nuestros especialistas. ¿Qué consulta o fecha requieres?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, defaultMsg]);
  };

  const quickPrompts = [
    {
      label: 'Agendar con Dra. López (14:30)',
      text: 'Hola, quiero agendar una cita con la Dra. López a las 14:30 para consulta médica.',
    },
    {
      label: 'Confirmar Cita con Reserva Temporal',
      text: 'Sí, confirmo la cita en ese horario.',
    },
    {
      label: 'Consulta Farmacológica (Prueba de Guardrail)',
      text: 'Tengo un dolor muy fuerte tras la cirugía y quiero duplicar el ketorolaco. ¿Puedo tomarlo?',
    },
    {
      label: 'Probar Colisión de Horario',
      text: 'Quiero agendar cita a las 14:30 hoy mismo.',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT: WhatsApp Simulated Screen */}
      <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden h-[640px] sm:h-[680px] transition-colors duration-200">
        {/* Compact WhatsApp Header */}
        <div className="bg-emerald-700 dark:bg-emerald-850 text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-emerald-400/40 p-1 flex items-center justify-center shrink-0 shadow-2xs">
              <NortIALogoIcon size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-xs sm:text-sm leading-tight text-white truncate flex items-center gap-1">
                  <span>Nort<span className="text-[#00D2FF]">IA</span> Health</span>
                </h3>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-800/90 text-emerald-100 border border-emerald-600/40">
                  Canal Asistido
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 truncate">
                Recepción y coordinación de citas médica
              </p>
            </div>
          </div>

          {/* Interlocutor & Related Patient identification */}
          <div className="text-right shrink-0 pl-2 text-[11px] leading-tight">
            <div className="text-emerald-100">
              <span className="text-emerald-300 font-medium">Contacto:</span> {interlocutorName}
            </div>
            <div className="text-emerald-200/90 text-[10px]">
              <span className="text-emerald-300/80">Paciente:</span> {currentPatientName}
            </div>
            <span className="text-[10px] font-mono text-emerald-300/75 block">
              {currentPatientPhone}
            </span>
          </div>
        </div>

        {/* Collapsible Quick Test Prompts - No Horizontal Overflow */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="px-3 py-1.5 flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Escenarios de prueba rápida ({quickPrompts.length})
            </span>
            <button
              type="button"
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              {showQuickPrompts ? 'Ocultar ▲' : 'Mostrar escenarios ▼'}
            </button>
          </div>

          {showQuickPrompts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 bg-slate-100/70 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p.text)}
                  className="p-1.5 text-left rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors text-[11px] leading-tight cursor-pointer"
                >
                  <span className="block font-semibold text-slate-900 dark:text-slate-100">{p.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">{p.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Scroll Area - Accessible & Constrained Line Length */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-100/60 dark:bg-slate-950/60 font-sans">
          <div className="text-center my-1">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs inline-block">
              Canal institucional de mensajería para agendamiento y orientación de servicios
            </span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[70ch] rounded-xl p-3 shadow-2xs text-xs font-sans ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : m.isEscalation
                      ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 rounded-tl-none'
                      : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Sender indicator */}
                  {!isUser && (
                    <div className="flex items-center gap-1.5 mb-1 font-semibold text-[10px]">
                      {m.isEscalation ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                          <span className="text-rose-800 dark:text-rose-300 uppercase font-bold tracking-tight">
                            Protocolo de Seguridad Activado • Derivación a Recepción
                          </span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Recepción Digital</span>
                        </>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>

                  {/* Tool Call Tag (Inspection) */}
                  {m.toolCall && (
                    <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 text-[10px] font-mono bg-slate-50/80 dark:bg-slate-900/80 p-1.5 rounded text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                        <Terminal className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Acción de sistema: {m.toolCall.name}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Parámetros: {JSON.stringify(m.toolCall.payload)}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] font-mono tabular-nums mt-1 text-right flex items-center justify-end gap-1 ${
                      isUser ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 w-fit px-3 py-1.5 rounded-xl rounded-tl-none shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px]">Consultando disponibilidad en agenda...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Pinned Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 transition-colors duration-200"
        >
          <input
            id="whatsapp-chat-input"
            type="text"
            aria-label="Mensaje para el canal de atención de WhatsApp"
            placeholder="Escribe un mensaje de consulta o solicitud de cita..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            id="whatsapp-send-button"
            type="submit"
            disabled={!inputVal.trim()}
            aria-label="Enviar mensaje al canal de WhatsApp"
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* RIGHT: Architecture & Trace Inspector */}
      <div className="lg:col-span-5 space-y-3.5">
        {/* Core Principles Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5 transition-colors duration-200">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Lógica Operacional de Atención (Guardrails & Locks)
          </h4>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">1.</span>
              <span>
                <strong>Reglas de Sistema:</strong> La atención automatizada opera como asistente administrativo. La disponibilidad y confirmación se ejecutan contra el motor de multiagenda.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">2.</span>
              <span>
                <strong>Reservas Temporales:</strong> Al proponer un horario se crea un bloqueo temporal con vencimiento, protegiendo el espacio contra sobreventa multicanal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">3.</span>
              <span>
                <strong>Protocolo de Derivación:</strong> Ante sintomatología clínica o consultas de prescripción, el flujo automatizado se detiene y transfiere el caso a recepción humana.
              </span>
            </li>
          </ul>
        </div>

        {/* Operational Trace Console */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 shadow-xs text-slate-300 font-mono text-[11px] space-y-2.5 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span>Registro de Operación & Enrutamiento</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {traceLogs.map((log, i) => (
              <div
                key={i}
                className={`p-2 rounded bg-slate-900/90 border border-slate-800/80 leading-relaxed text-xs ${
                  log.includes('GUARDRAIL') || log.includes('Conflicto')
                    ? 'text-rose-300 border-rose-900/50 bg-rose-950/20'
                    : log.includes('Bloqueo') || log.includes('confirmada')
                    ? 'text-emerald-300 border-emerald-900/50'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Flujo de Atención de Citas</span>
            <span>Mensajería Institucional</span>
          </div>
        </div>
      </div>
    </div>
  );
};
