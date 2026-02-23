interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function SardineSvg({ size = 32, colorTheme = 'default', animationEnabled = true }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {animationEnabled && (
        <style>{`
          @keyframes sardineFin { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
          .sardine-fin { transform-origin: center; animation: sardineFin 1.5s ease-in-out infinite; }
        `}</style>
      )}
      {/* Body — elongated ellipse */}
      <ellipse cx="15" cy="16" rx="11" ry="6" fill="#89b4d8" />
      {/* Tail */}
      <polygon points="26,16 30,12 30,20" fill="#5a8aaa" />
      {/* Belly highlight */}
      <ellipse cx="14" cy="17" rx="7" ry="3" fill="#b8d4e8" fillOpacity="0.5" />
      {/* Dorsal fin */}
      <path className={animationEnabled ? "sardine-fin" : ""} d="M10,10 Q14,6 18,10" stroke="#5a8aaa" strokeWidth="1.5" fill="none" />
      {/* Eye */}
      <circle cx="6" cy="15" r="2" fill="white" />
      <circle cx="6.5" cy="15" r="1" fill="#1a2a3a" />
    </svg>
  );
}
