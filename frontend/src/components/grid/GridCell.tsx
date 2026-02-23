import React from 'react';
import type { Cell } from '../../types/simulation.types';
import type { CellChangeType } from '../../hooks/useGridDiff';
import type { SpeciesSvgProps } from '../species';
import { PlanktonSvg, SardineSvg, SharkSvg, CrabSvg, ReefSvg, DeadSardineSvg, DeadSharkSvg } from '../species';

interface GridCellProps {
  cell: Cell;
  size: number;
  animState?: CellChangeType;
}

type SvgAnimState = SpeciesSvgProps['animState'];

function toSvgAnim(c?: CellChangeType): SvgAnimState {
  if (c === 'born')      return 'born';
  if (c === 'died')      return 'dying';
  if (c === 'moved')     return 'moving';
  return 'normal';
}

const SvgMap: Partial<Record<string, React.ComponentType<SpeciesSvgProps>>> = {
  Plankton:    PlanktonSvg,
  Sardine:     SardineSvg,
  Shark:       SharkSvg,
  Crab:        CrabSvg,
  Reef:        ReefSvg,
  DeadSardine: DeadSardineSvg,
  DeadShark:   DeadSharkSvg,
};

export const GridCell = React.memo(({ cell, size, animState }: GridCellProps) => {
  const SvgComponent = SvgMap[cell.specimenType];
  return (
    <div
      data-testid={`cell-${cell.position.row}-${cell.position.col}`}
      data-anim={animState}
      className="flex items-center justify-center bg-[#0d1b2a] border border-[rgba(255,255,255,0.04)]"
      style={{ width: size, height: size }}
    >
      {SvgComponent && <SvgComponent size={Math.max(16, size - 4)} animState={toSvgAnim(animState)} />}
    </div>
  );
});

GridCell.displayName = 'GridCell';
