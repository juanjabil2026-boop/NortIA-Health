import React from 'react';

interface NortIALogoProps {
  /** Size variant or pixel dimension */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to show the text wordmark alongside the emblem */
  showText?: boolean;
  /** Product suffix: 'health' | 'creative' | 'none' */
  productSuffix?: 'health' | 'creative' | 'none';
  /** Show the 'Ecosistema NortIA' badge */
  showEcosystemBadge?: boolean;
  /** Additional container classes */
  className?: string;
  /** Text color override or auto dark/light */
  lightTextColor?: boolean;
}

/**
 * NortIALogoIcon renders the exact multi-faceted 4-pointed star emblem
 * with the signature neon cyan neural constellation overlay from the NortIA brand.
 */
export const NortIALogoIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Logo NortIA"
    >
      <defs>
        {/* Gradients for the 8 facets */}
        {/* North-West (Upper Left) */}
        <linearGradient id="facet-nw" x1="46" y1="12" x2="36" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        {/* North-East (Upper Right) */}
        <linearGradient id="facet-ne" x1="46" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        {/* East-North (Right Upper) */}
        <linearGradient id="facet-en" x1="46" y1="52" x2="84" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        {/* East-South (Right Lower) */}
        <linearGradient id="facet-es" x1="46" y1="52" x2="70" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>

        {/* South-East (Bottom Right) */}
        <linearGradient id="facet-se" x1="46" y1="52" x2="56" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1E28" />
          <stop offset="100%" stopColor="#042F2E" />
        </linearGradient>

        {/* South-West (Bottom Left) */}
        <linearGradient id="facet-sw" x1="46" y1="52" x2="46" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="60%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>

        {/* West-South (Left Lower) */}
        <linearGradient id="facet-ws" x1="46" y1="52" x2="8" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* West-North (Left Upper) */}
        <linearGradient id="facet-wn" x1="8" y1="52" x2="46" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="70%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Constellation Glow */}
        <filter id="nortia-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#00D2FF" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* --- 8-Faceted Star Body --- */}
      <g>
        {/* Facet 1: North-West */}
        <polygon points="46,52 36,42 46,12" fill="url(#facet-nw)" />
        {/* Facet 2: North-East */}
        <polygon points="46,52 46,12 56,42" fill="url(#facet-ne)" />
        {/* Facet 3: East-North */}
        <polygon points="46,52 56,42 84,52" fill="url(#facet-en)" />
        {/* Facet 4: East-South */}
        <polygon points="46,52 84,52 56,62" fill="url(#facet-es)" />
        {/* Facet 5: South-East */}
        <polygon points="46,52 56,62 46,92" fill="url(#facet-se)" />
        {/* Facet 6: South-West */}
        <polygon points="46,52 46,92 36,62" fill="url(#facet-sw)" />
        {/* Facet 7: West-South */}
        <polygon points="46,52 36,62 8,52" fill="url(#facet-ws)" />
        {/* Facet 8: West-North */}
        <polygon points="46,52 8,52 36,42" fill="url(#facet-wn)" />
      </g>

      {/* Center Crease Accent Lines for crisp faceted feel */}
      <line x1="46" y1="12" x2="46" y2="92" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.18" />
      <line x1="8" y1="52" x2="84" y2="52" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.18" />

      {/* --- Neural Constellation / Network Cluster (Upper Right) --- */}
      <g filter="url(#nortia-cyan-glow)">
        {/* Interconnected Network Lines */}
        <line x1="46" y1="52" x2="63" y2="37" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="63" y1="37" x2="74" y2="18" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="63" y1="37" x2="85" y2="31" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="74" y1="18" x2="85" y2="31" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="46" y1="52" x2="85" y2="31" stroke="#00D2FF" strokeWidth="1.3" strokeOpacity="0.75" strokeLinecap="round" />

        {/* Network Nodes (Dots) */}
        {/* Node 1: Root / Star Center */}
        <circle cx="46" cy="52" r="2.8" fill="#00D2FF" />
        <circle cx="46" cy="52" r="1.2" fill="#FFFFFF" />

        {/* Node 2: Mid-right bridge */}
        <circle cx="63" cy="37" r="3" fill="#00D2FF" />
        <circle cx="63" cy="37" r="1.3" fill="#FFFFFF" />

        {/* Node 3: Top Peak Node (Prominent) */}
        <circle cx="74" cy="18" r="4.2" fill="#00D2FF" />
        <circle cx="74" cy="18" r="1.8" fill="#FFFFFF" />

        {/* Node 4: Outer East Node */}
        <circle cx="85" cy="31" r="3.4" fill="#00D2FF" />
        <circle cx="85" cy="31" r="1.4" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

export const NortIALogo: React.FC<NortIALogoProps> = ({
  size = 'md',
  showText = true,
  productSuffix = 'health',
  showEcosystemBadge = true,
  className = '',
  lightTextColor = false,
}) => {
  // Resolve pixel size
  const iconPixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 26
      : size === 'md'
      ? 34
      : size === 'lg'
      ? 44
      : 56;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Exact Brand Star & Constellation Icon */}
      <NortIALogoIcon size={iconPixelSize} />

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-tight font-bold">
            {/* 'Nort' in primary text */}
            <span
              className={`text-base sm:text-lg font-bold tracking-tight ${
                lightTextColor
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              Nort
            </span>

            {/* 'IA' in signature electric cyan */}
            <span className="text-base sm:text-lg font-extrabold text-[#00D2FF] tracking-tight">
              IA
            </span>

            {/* Product extension (e.g. 'Health' or 'creative') */}
            {productSuffix === 'health' && (
              <span
                className={`text-base sm:text-lg font-bold ml-1 ${
                  lightTextColor
                    ? 'text-white'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                Health
              </span>
            )}
            {productSuffix === 'creative' && (
              <span
                className={`text-base sm:text-lg font-bold ml-0.5 ${
                  lightTextColor
                    ? 'text-white'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                creative
              </span>
            )}

            {/* Core version tag */}
            {productSuffix === 'health' && (
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold hidden sm:inline-block">
                Core v1.0
              </span>
            )}
          </div>

          {/* Ecosystem Indicator */}
          {showEcosystemBadge && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-0.5 flex items-center gap-1">
              <span>Producto del Ecosistema</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Nort<span className="text-[#00D2FF]">IA</span>
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
