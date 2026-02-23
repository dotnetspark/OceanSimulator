import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function ReefSvg({ size = 24, animated: _animated = false, animState = 'normal' }: SpeciesSvgProps) {
  // Reef is static — no idle animation, but supports born/dying for spawn effects
  let animClass = '';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass}>
        {/* Main coral rock body */}
        <polygon 
          points="4,20 3,15 6,10 9,7 14,6 19,9 22,14 21,20" 
          fill={palette.reef} 
          stroke={palette.reefDark}
          strokeWidth="0.5"
        />
        {/* Coral spires */}
        <polygon points="9,7 11,2 13,6" fill="#9b8265" />
        <polygon points="14,6 17,3 19,9 16,7" fill={palette.reef} />
      </g>
    </svg>
  );
}
