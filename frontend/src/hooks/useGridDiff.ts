import { useRef } from 'react';
import type { OceanGrid } from '../types/simulation.types';

export type CellChangeType = 'born' | 'died' | 'moved' | 'unchanged';

export function computeGridDiff(
  prev: OceanGrid | null,
  curr: OceanGrid | null,
): Map<string, CellChangeType> {
  const map = new Map<string, CellChangeType>();
  if (!prev || !curr) return map;

  for (let r = 0; r < curr.rows; r++) {
    for (let c = 0; c < curr.cols; c++) {
      const prevCell = prev.cells[r]?.[c];
      const currCell = curr.cells[r]?.[c];
      if (!prevCell || !currCell) continue;

      const key = `${r}-${c}`;
      const prevType = prevCell.specimenType;
      const currType = currCell.specimenType;

      if (prevType === currType) {
        map.set(key, 'unchanged');
      } else if (prevType === 'Water') {
        map.set(key, 'born');
      } else if (currType === 'Water') {
        map.set(key, 'died');
      } else {
        map.set(key, 'moved');
      }
    }
  }
  return map;
}

/** Tracks grid changes between renders. Returns a diff map keyed by `${row}-${col}`. */
export function useGridDiff(currentGrid: OceanGrid | null): Map<string, CellChangeType> {
  const prevGridRef = useRef<OceanGrid | null>(null);
  const changedCellsRef = useRef<Map<string, CellChangeType>>(new Map());

  if (currentGrid !== prevGridRef.current) {
    changedCellsRef.current = computeGridDiff(prevGridRef.current, currentGrid);
    prevGridRef.current = currentGrid;
  }

  return changedCellsRef.current;
}
