/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicalProvider } from './context/ClinicalContext';
import type { ClinicalTab } from './types/clinical';
import { ThemeProvider } from './context/ThemeContext';
import { ClinicalNavbar } from './components/clinical/ClinicalNavbar';
import { AgendaView } from './components/clinical/AgendaView';
import { WhatsAppSimulatorView } from './components/clinical/WhatsAppSimulatorView';
import { EscalationsInboxView } from './components/clinical/EscalationsInboxView';
import { PatientsCrmView } from './components/clinical/PatientsCrmView';
import { InventoryFefoView } from './components/clinical/InventoryFefoView';
import { ServicesConfigView } from './components/clinical/ServicesConfigView';
import { AuditObservabilityView } from './components/clinical/AuditObservabilityView';
import { NortIALogo } from './components/common/NortIALogo';
import { ShieldCheck, Activity } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ClinicalTab>('agenda');

  return (
    <ThemeProvider>
      <ClinicalProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
          {/* Clinic App Navigation & Header Bar */}
          <ClinicalNavbar currentTab={currentTab} onTabChange={setCurrentTab} />

          <div className="bg-amber-50 text-amber-900 px-4 py-2 text-center text-sm" role="note">Demostración local · Usa datos ficticios. WhatsApp y roles son simulados; no ingreses información real de pacientes.</div>

          {/* Active Clinic Operational Screen */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentTab === 'agenda' && <AgendaView />}
            {currentTab === 'whatsapp' && <WhatsAppSimulatorView />}
            {currentTab === 'inbox' && <EscalationsInboxView />}
            {currentTab === 'patients' && <PatientsCrmView />}
            {currentTab === 'inventory' && <InventoryFefoView />}
            {currentTab === 'services' && <ServicesConfigView />}
            {currentTab === 'audit' && <AuditObservabilityView />}
          </main>

          {/* Clinical Application Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-auto text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <NortIALogo size="sm" productSuffix="health" showEcosystemBadge={false} />
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Centro de Especialidades Médicas • Sede Roma Norte
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Producto del Ecosistema <strong className="font-bold text-slate-800 dark:text-slate-200">Nort<span className="text-[#00D2FF]">IA</span></strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Motor Clínico Operativo
                </span>
                <span>•</span>
                <span>Protocolo Anti-Double Booking</span>
                <span>•</span>
                <span>Dispensación FEFO</span>
              </div>
            </div>
          </footer>
        </div>
      </ClinicalProvider>
    </ThemeProvider>
  );
}
