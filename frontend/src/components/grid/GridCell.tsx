import React from 'react';
import type { Cell } from '../../types/simulation.types';
import { PlanktonSvg, SardineSvg, SharkSvg, CrabSvg, ReefSvg, DeadSardineSvg, DeadSharkSvg } from '../species';

interface GridCellProps {
  cell: Cell;
  size: number;
}

const SvgMap: Partial<Record<string, React.ComponentType<{ size: number }>>> = {
  Plankton: PlanktonSvg,
  Sardine: SardineSvg,
  Shark: SharkSvg,
  Crab: CrabSvg,
  Reef: ReefSvg,
  DeadSardine: DeadSardineSvg,
  DeadShark: DeadSharkSvg,
};

export const GridCell = React.memo(({ cell, size }: GridCellProps) => {
  const SvgComponent = SvgMap[cell.specimenType];
  return (
    <div 
      data-testid={`cell-${cell.position.row}-${cell.position.col}`}
      style={{ width: size, height: size, background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {SvgComponent && <SvgComponent size={Math.max(16, size - 4)} />}
    </div>
  );
});

GridCell.displayName = 'GridCell';
