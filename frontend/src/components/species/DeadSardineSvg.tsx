interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function DeadSardineSvg({ size = 32, colorTheme = 'default', animationEnabled = false }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — same shape, desaturated */}
      <ellipse cx="15" cy="16" rx="11" ry="6" fill="#4a5a6a" />
      {/* Tail */}
      <polygon points="26,16 30,12 30,20" fill="#3a4a5a" />
      {/* Belly — faded */}
      <ellipse cx="14" cy="17" rx="7" ry="3" fill="#5a6a7a" fillOpacity="0.4" />
      {/* X Eye */}
      <line x1="4" y1="13" x2="8" y2="17" stroke="#e8f4f8" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="8" y1="13" x2="4" y2="17" stroke="#e8f4f8" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}
