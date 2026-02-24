import { useRef, useState, useEffect } from 'react';
import { GridCell } from './GridCell';
import type { OceanGrid as OceanGridType } from '../../types/simulation.types';
import type { CellChangeType } from '../../hooks/useGridDiff';

interface OceanGridProps {
  grid: OceanGridType | null | undefined;
  changedCells?: Map<string, CellChangeType>;
}

export function OceanGrid({ grid, changedCells }: OceanGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(600);

  // Early return if grid is not yet loaded
  if (!grid) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-[#7a9bb5]">
          <div className="text-5xl mb-3">🌊</div>
          <div className="text-sm">Loading ocean…</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) {
        const { width, height } = e.contentRect;
        setContainerSize(Math.min(width, height) - 8);
      }
    });
    ro.observe(containerRef.current);
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0) setContainerSize(Math.min(rect.width, rect.height) - 8);
    return () => ro.disconnect();
  }, []);

  const cellSize = Math.max(14, Math.min(48, Math.floor(containerSize / Math.max(grid.rows, grid.cols))));

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div
        data-testid="ocean-grid"
        className="bg-[#8cc4d8]"
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
    </div>
  );
}
