import React from 'react';
import type { SpecimenType } from '../../types/simulation.types';
import { PlanktonSvg, SardineSvg, SharkSvg, CrabSvg, ReefSvg, DeadSardineSvg, DeadSharkSvg } from '../species';

interface GridCellProps {
  specimenType: SpecimenType;
  size: number;
}

const SvgMap: Partial<Record<SpecimenType, React.ComponentType<{ size: number }>>> = {
  Plankton: PlanktonSvg,
  Sardine: SardineSvg,
  Shark: SharkSvg,
  Crab: CrabSvg,
  Reef: ReefSvg,
  DeadSardine: DeadSardineSvg,
  DeadShark: DeadSharkSvg,
};

export const GridCell = React.memo(({ specimenType, size }: GridCellProps) => {
  const SvgComponent = SvgMap[specimenType];
  return (
    <div style={{ width: size, height: size, background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {SvgComponent && <SvgComponent size={Math.max(16, size - 4)} />}
    </div>
  );
});

GridCell.displayName = 'GridCell';
