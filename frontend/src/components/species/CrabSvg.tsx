import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function CrabSvg({ size = 24, animated = true, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = 'crab-idle';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  if (animState === 'moving') animClass = 'species-moving';
  const pausedClass = !animated && animState === 'normal' ? ' anim-paused' : '';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass + pausedClass}>
        {/* Body — wide oval */}
        <ellipse cx="12" cy="13" rx="8" ry="5" fill={palette.crab} />
        {/* Left claw bump - KEY identifier */}
        <circle cx="3" cy="12" r="3" fill={palette.crabDark} />
        {/* Right claw bump - KEY identifier */}
        <circle cx="21" cy="12" r="3" fill={palette.crabDark} />
        {/* Eyes on top */}
        <circle cx="10" cy="8" r="1.5" fill="#1a2a3a" />
        <circle cx="14" cy="8" r="1.5" fill="#1a2a3a" />
      </g>
    </svg>
  );
}
