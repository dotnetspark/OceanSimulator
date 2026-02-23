interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function PlanktonSvg({ size = 32, colorTheme = 'default', animationEnabled = true }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {animationEnabled && (
        <style>{`
          @keyframes planktonPulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          .plankton-body { transform-origin: center; animation: planktonPulse 2s ease-in-out infinite; }
        `}</style>
      )}
      {/* Outer glow ring */}
      <circle cx="16" cy="16" r="12" fill="#7ec8a0" fillOpacity="0.15" />
      {/* Main body */}
      <circle className={animationEnabled ? "plankton-body" : ""} cx="16" cy="16" r="8" fill="#7ec8a0" fillOpacity="0.75" />
      {/* Inner nucleus */}
      <circle cx="16" cy="16" r="4" fill="#a8e6c3" fillOpacity="0.9" />
      {/* Tendrils */}
      <line x1="16" y1="4" x2="16" y2="8" stroke="#7ec8a0" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="16" y1="24" x2="16" y2="28" stroke="#7ec8a0" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="4" y1="16" x2="8" y2="16" stroke="#7ec8a0" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="24" y1="16" x2="28" y2="16" stroke="#7ec8a0" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}
