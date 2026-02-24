import React from 'react';
import type { Cell } from '../../types/simulation.types';
import type { CellChangeType } from '../../hooks/useGridDiff';

interface GridCellProps {
  cell: Cell;
  size: number;
  animState?: CellChangeType;
}

const EmojiMap: Partial<Record<string, string>> = {
  Plankton:    '🦐',
  Sardine:     '🐟',
  Shark:       '🦈',
  Crab:        '🦀',
  Reef:        '🪸',
  DeadSardine: '🐟',
  DeadShark:   '🦈',
};

const isDead = (t: string) => t === 'DeadSardine' || t === 'DeadShark';

export const GridCell = React.memo(({ cell, size, animState }: GridCellProps) => {
  const emoji = EmojiMap[cell.specimenType];
  const dead = isDead(cell.specimenType);
  const fontSize = Math.max(10, Math.floor(size * 0.72));

  let animClass = '';
  if (animState === 'born') animClass = 'species-born';
  else if (animState === 'died') animClass = 'species-dying';
  else if (animState === 'moved') animClass = 'species-moving';

  return (
    <div
      data-testid={`cell-${cell.position.row}-${cell.position.col}`}
      data-anim={animState}
      className="flex items-center justify-center bg-[#b8d8e8]"
      style={{ width: size, height: size }}
    >
      {emoji && (
        <span
          className={animClass || undefined}
          style={{
            fontSize,
            lineHeight: 1,
            opacity: dead ? 0.45 : 1,
            filter: dead ? 'grayscale(80%)' : undefined,
            display: 'block',
          }}
        >
          {emoji}
        </span>
      )}
    </div>
  );
});

GridCell.displayName = 'GridCell';
