import { GridCell } from './GridCell';
import type { OceanGrid as OceanGridType } from '../../types/simulation.types';

interface OceanGridProps {
  grid: OceanGridType;
}

export function OceanGrid({ grid }: OceanGridProps) {
  const cellSize = Math.max(20, Math.min(40, Math.floor(600 / Math.max(grid.rows, grid.cols))));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, ${cellSize}px)`,
        gap: 0,
        backgroundColor: '#000',
      }}
    >
      {grid.cells.flat().map((cell, i) => (
        <GridCell key={i} specimenType={cell.specimenType} size={cellSize} />
      ))}
    </div>
  );
}
