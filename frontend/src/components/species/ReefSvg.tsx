interface SpeciesSvgProps {
  size?: number;
  colorTheme?: 'default' | 'high-contrast';
  animationEnabled?: boolean;
}

export function ReefSvg({ size = 32, colorTheme = 'default', animationEnabled = false }: SpeciesSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main rock body */}
      <polygon points="6,26 4,20 8,14 12,10 18,8 24,12 28,18 26,26" fill="#8b7355" />
      {/* Rock face texture */}
      <polygon points="8,24 7,19 11,15 16,12 21,14 24,20 22,24" fill="#7a6245" />
      {/* Coral/highlight top */}
      <polygon points="12,10 16,4 20,8 18,8" fill="#9b8265" />
      <polygon points="18,8 22,5 24,12 20,10" fill="#8b7255" />
      {/* Shadow base */}
      <ellipse cx="16" cy="26" rx="10" ry="2" fill="#5a4a35" fillOpacity="0.4" />
    </svg>
  );
}
