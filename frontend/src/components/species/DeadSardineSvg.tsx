import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function DeadSardineSvg({ size = 24, animated: _animated = false, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = '';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
      <g className={animClass}>
        {/* Forked tail — desaturated */}
        <polygon points="21,12 24,8 24,16" fill={palette.deadDark} />
        {/* Body — desaturated grey */}
        <ellipse cx="11" cy="12" rx="9" ry="4" fill={palette.dead} />
        {/* X eye marks */}
        <line x1="3" y1="10" x2="6" y2="13" stroke="#e8f4f8" strokeWidth="1.5" />
        <line x1="6" y1="10" x2="3" y2="13" stroke="#e8f4f8" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
