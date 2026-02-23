interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function SharkSvg({ size = 32, colorTheme = 'default', animationEnabled = true }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {animationEnabled && (
        <style>{`
          @keyframes sharkSway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1px); } }
          .shark-body { transform-origin: center; animation: sharkSway 3s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animationEnabled ? "shark-body" : ""}>
        {/* Main body — angular ellipse */}
        <ellipse cx="15" cy="17" rx="13" ry="7" fill="#546e7a" />
        {/* Snout — pointed */}
        <polygon points="2,17 6,13 6,21" fill="#37474f" />
        {/* Tail */}
        <polygon points="28,17 32,11 32,23" fill="#37474f" />
        {/* Dorsal fin — prominent */}
        <polygon points="14,10 18,3 22,10" fill="#455a64" />
        {/* Pectoral fin */}
        <polygon points="10,19 8,26 16,21" fill="#455a64" />
        {/* Belly */}
        <ellipse cx="14" cy="19" rx="9" ry="3.5" fill="#78909c" fillOpacity="0.5" />
        {/* Eye — cold, flat */}
        <circle cx="6" cy="16" r="2" fill="#1a2a3a" />
        <circle cx="6" cy="16" r="0.8" fill="#000" />
        {/* Gill slits */}
        <line x1="9" y1="13" x2="9" y2="20" stroke="#37474f" strokeWidth="0.8" />
        <line x1="11" y1="12" x2="11" y2="21" stroke="#37474f" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
