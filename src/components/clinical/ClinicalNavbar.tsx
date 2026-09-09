import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { useTheme } from '../../context/ThemeContext';
import { ClinicalTab, UserRole } from '../../types/clinical';
import { NortIALogo } from '../common/NortIALogo';
import {
  Calendar,
  MessageSquare,
  AlertTriangle,
  Users,
  Package,
  Sliders,
  ShieldCheck,
  Building2,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';

export type { ClinicalTab };
export type ClinicalViewTab = ClinicalTab;

interface ClinicalNavbarProps {
  currentTab: ClinicalTab;
  onTabChange: (tab: ClinicalTab) => void;
}

export const ClinicalNavbar: React.FC<ClinicalNavbarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const {
    currentRole,
    setCurrentRole,
    currentDate,
    setCurrentDate,
    locks,
    escalations,
    resetDatabase,
  } = useClinical();

  const { theme, toggleTheme } = useTheme();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const activeLocksCount = locks.filter(
    (l) => l.status === 'active' && l.expiresAt > Date.now()
  ).length;

  const pendingEscalationsCount = escalations.filter(
    (e) => e.status === 'pendiente'
  ).length;

  const executeReset = () => {
    setIsRefreshing(true);
    setShowConfirmReset(false);
    resetDatabase();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems: {
    id: ClinicalTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'agenda',
      label: 'Multiagenda & Citas',
      icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
      badge: activeLocksCount > 0 ? activeLocksCount : undefined,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'whatsapp',
      label: 'Canal WhatsApp (Bot IA)',
      icon: <MessageSquare className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'inbox',
      label: 'Inbox Escalamientos',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
      badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'patients',
      label: 'Pacientes & CRM',
      icon: <Users className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'inventory',
      label: 'Inventario & Farmacia (FEFO)',
      icon: <Package className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'services',
      label: 'Reglas & Servicios',
      icon: <Sliders className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'audit',
      label: 'Auditoría & Observabilidad',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      {/* Top Clinic Branding & User Role Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand & Sede */}
        <div className="flex items-center gap-3 min-w-0">
          <NortIALogo size="md" productSuffix="health" showEcosystemBadge={true} />
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">Centro de Especialidades Médicas • Sede Roma Norte</span>
          </div>
        </div>

        {/* Operational Controls: Date, Role, Theme Toggle, Refresh */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Operational Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
            <label htmlFor="operational-date-input" className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Fecha operativa:
            </label>
            <input
              id="operational-date-input"
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="font-bold text-slate-800 dark:text-slate-100 text-xs bg-transparent focus:outline-hidden cursor-pointer"
            />
          </div>

          {/* User Role Switcher (RBAC simulation) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-transparent dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-1.5 hidden sm:inline">
              Rol:
            </span>
            {(['receptionist', 'doctor', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setCurrentRole(r)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  currentRole === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {r === 'receptionist' && 'Recepción'}
                {r === 'doctor' && 'Médico'}
                {r === 'admin' && 'Admin'}
              </button>
            ))}
          </div>

          {/* Dark / Light Mode Selector */}
          <button
            type="button"
            id="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo Oscuro activo. Clic para cambiar a Modo Claro' : 'Modo Claro activo. Clic para cambiar a Modo Oscuro'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors cursor-pointer text-xs font-semibold"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] hidden sm:inline">Oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] hidden sm:inline">Claro</span>
              </>
            )}
          </button>

          {/* Reset / Sync Button with In-Place Safe Confirmation */}
          {showConfirmReset ? (
            <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-lg text-xs">
              <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-200">¿Restablecer datos?</span>
              <button
                type="button"
                onClick={executeReset}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-[10px] cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              disabled={isRefreshing}
              aria-label="Restablecer datos clínicos iniciales"
              title="Restablecer datos de demostración a su estado inicial"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Navegación de módulos clínicos"
          className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`clinical-tab-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-slate-700 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

