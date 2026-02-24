import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function DeadSharkSvg({ size = 24, animated: _animated = false, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = '';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
      <g className={animClass}>
        {/* Crescent tail — desaturated */}
        <polygon points="21,12 24,7 24,17" fill={palette.deadDark} />
        {/* Torpedo body — grey */}
        <ellipse cx="11" cy="12" rx="10" ry="5" fill={palette.dead} />
        {/* Dorsal fin - KEY identifier */}
        <polygon points="8,7 11,1 14,7" fill={palette.deadDark} />
        {/* X eye marks */}
        <line x1="3" y1="10" x2="6" y2="13" stroke="#e8f4f8" strokeWidth="1.5" />
        <line x1="6" y1="10" x2="3" y2="13" stroke="#e8f4f8" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
