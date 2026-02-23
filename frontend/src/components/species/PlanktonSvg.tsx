import { palette } from '../../styles/palette';

export interface SpeciesSvgProps {
  size?: number;
  animated?: boolean;
  animState?: 'normal' | 'born' | 'dying' | 'moving';
}

export function PlanktonSvg({ size = 24, animated = true, animState = 'normal' }: SpeciesSvgProps) {
  let animClass = 'plankton-idle';
  if (animState === 'born') animClass = 'species-born';
  if (animState === 'dying') animClass = 'species-dying';
  if (animState === 'moving') animClass = 'species-moving';
  const pausedClass = !animated && animState === 'normal' ? ' anim-paused' : '';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass + pausedClass}>
        {/* Soft glow ring */}
        <circle cx="12" cy="12" r="10" fill={palette.plankton} fillOpacity="0.2" />
        {/* Main body - central glowing circle */}
        <circle cx="12" cy="12" r="7" fill={palette.plankton} fillOpacity="0.9" />
        {/* Bright nucleus */}
        <circle cx="12" cy="12" r="2.5" fill="#c8f0d8" />
      </g>
    </svg>
  );
}
