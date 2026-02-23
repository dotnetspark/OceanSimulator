interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function DeadSharkSvg({ size = 32, colorTheme = 'default', animationEnabled = false }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — faded */}
      <ellipse cx="15" cy="17" rx="13" ry="7" fill="#3a4a5a" />
      <polygon points="2,17 6,13 6,21" fill="#2a3a4a" />
      <polygon points="28,17 32,11 32,23" fill="#2a3a4a" />
      {/* Dorsal fin */}
      <polygon points="14,10 18,3 22,10" fill="#2e3e4e" />
      {/* Belly */}
      <ellipse cx="14" cy="19" rx="9" ry="3.5" fill="#4a5a6a" fillOpacity="0.4" />
      {/* X Eye */}
      <line x1="4" y1="14" x2="8" y2="18" stroke="#e8f4f8" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="8" y1="14" x2="4" y2="18" stroke="#e8f4f8" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}
