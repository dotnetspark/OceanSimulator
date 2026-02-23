interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function CrabSvg({ size = 32, colorTheme = 'default', animationEnabled = true }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — rounded rectangle top-down */}
      <ellipse cx="16" cy="16" rx="8" ry="6" fill="#e07b39" />
      {/* Shell pattern */}
      <ellipse cx="16" cy="15" rx="5" ry="4" fill="#c85f20" fillOpacity="0.5" />
      {/* Left claw */}
      <path d="M8,14 Q3,10 2,13 Q1,16 5,17 Q7,17 8,16" fill="#c85f20" stroke="#a04818" strokeWidth="0.5" />
      {/* Right claw */}
      <path d="M24,14 Q29,10 30,13 Q31,16 27,17 Q25,17 24,16" fill="#c85f20" stroke="#a04818" strokeWidth="0.5" />
      {/* Legs left */}
      <line x1="10" y1="14" x2="6" y2="11" stroke="#a04818" strokeWidth="1.2" />
      <line x1="10" y1="16" x2="5" y2="16" stroke="#a04818" strokeWidth="1.2" />
      <line x1="10" y1="18" x2="6" y2="21" stroke="#a04818" strokeWidth="1.2" />
      {/* Legs right */}
      <line x1="22" y1="14" x2="26" y2="11" stroke="#a04818" strokeWidth="1.2" />
      <line x1="22" y1="16" x2="27" y2="16" stroke="#a04818" strokeWidth="1.2" />
      <line x1="22" y1="18" x2="26" y2="21" stroke="#a04818" strokeWidth="1.2" />
      {/* Eyes */}
      <circle cx="13" cy="12" r="1.5" fill="black" />
      <circle cx="19" cy="12" r="1.5" fill="black" />
      <circle cx="13.5" cy="11.5" r="0.5" fill="white" />
      <circle cx="19.5" cy="11.5" r="0.5" fill="white" />
    </svg>
  );
}
