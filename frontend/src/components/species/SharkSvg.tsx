import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function SharkSvg({ size = 24, animated = true, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = 'shark-idle';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  if (animState === 'moving') animClass = 'species-moving';
  const pausedClass = !animated && animState === 'normal' ? ' anim-paused' : '';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass + pausedClass}>
        {/* Crescent tail */}
        <polygon points="21,12 24,7 24,17" fill={palette.sharkDark} />
        {/* Torpedo body */}
        <ellipse cx="11" cy="12" rx="10" ry="5" fill={palette.shark} />
        {/* PROMINENT dorsal fin - KEY identifier */}
        <polygon points="8,7 11,1 14,7" fill={palette.sharkDark} />
        {/* Cold eye */}
        <circle cx="4" cy="11" r="1.2" fill="#1a2a3a" />
      </g>
    </svg>
  );
}
