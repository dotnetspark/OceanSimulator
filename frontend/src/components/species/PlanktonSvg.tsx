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
  
  const c = palette.plankton;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={animClass + pausedClass}>
        {/* Body — curved arc from head (right) to tail (left) */}
        <path d="M 19 9 Q 15 6 11 9 Q 7 12 5 16" stroke={c} strokeWidth="2.8" strokeLinecap="round" fill="none"/>
        {/* Head */}
        <circle cx="19" cy="9" r="2.2" fill={c} />
        {/* Eye */}
        <circle cx="20" cy="8" r="0.7" fill="#c8f0d8" />
        {/* Antennae */}
        <line x1="19" y1="7" x2="22" y2="4" stroke={c} strokeWidth="0.9" strokeLinecap="round"/>
        <line x1="18" y1="7" x2="21" y2="3" stroke={c} strokeWidth="0.7" strokeLinecap="round"/>
        {/* Legs */}
        <line x1="15" y1="8"  x2="14" y2="11" stroke={c} strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="12" y1="10" x2="11" y2="13" stroke={c} strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="9"  y1="12" x2="8"  y2="15" stroke={c} strokeWidth="0.8" strokeLinecap="round"/>
        {/* Tail fan */}
        <line x1="5" y1="16" x2="3" y2="14" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="5" y1="16" x2="3" y2="17" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="5" y1="16" x2="4" y2="19" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
