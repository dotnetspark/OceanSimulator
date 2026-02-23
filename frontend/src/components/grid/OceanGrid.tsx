import { GridCell } from './GridCell';
import type { OceanGrid as OceanGridType } from '../../types/simulation.types';
import type { CellChangeType } from '../../hooks/useGridDiff';

interface OceanGridProps {
  grid: OceanGridType;
  changedCells?: Map<string, CellChangeType>;
}

export function OceanGrid({ grid, changedCells }: OceanGridProps) {
  // Use actual available viewport space for better scaling
  const containerSize = Math.min(
    typeof window !== 'undefined' ? window.innerWidth * 0.60 : 800,
    typeof window !== 'undefined' ? window.innerHeight * 0.85 : 600
  );
  const cellSize = Math.max(18, Math.min(52, Math.floor(containerSize / Math.max(grid.rows, grid.cols))));

  return (
    <div
      data-testid="ocean-grid"
      className="bg-black"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, ${cellSize}px)`,
        gap: 0,
      }}
    >
      {grid.cells.flat().map((cell, i) => {
        const key = `${cell.position.row}-${cell.position.col}`;
        return (
          <GridCell
            key={i}
            cell={cell}
            size={cellSize}
            animState={changedCells?.get(key)}
          />
        );
      })}
    </div>
  );
}
