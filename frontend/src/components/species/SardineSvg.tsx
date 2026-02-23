import { palette } from '../../styles/palette';
import type { SpeciesSvgProps } from './PlanktonSvg';

export function SardineSvg({ size = 24, animated = true, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = 'sardine-idle';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  if (animState === 'moving') animClass = 'species-moving';
  const pausedClass = !animated && animState === 'normal' ? ' anim-paused' : '';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass + pausedClass}>
        {/* Forked tail */}
        <polygon points="21,12 24,8 24,16" fill={palette.sardineDark} />
        {/* Body — bold teardrop */}
        <ellipse cx="11" cy="12" rx="9" ry="4" fill={palette.sardine} />
        {/* Eye - bright white with dark pupil */}
        <circle cx="4" cy="11" r="1.5" fill="white" />
        <circle cx="4.3" cy="11" r="0.7" fill="#1a2a3a" />
      </g>
    </svg>
  );
}
