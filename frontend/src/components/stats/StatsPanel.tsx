import { useState, useRef, useEffect } from 'react';
import { PopulationGraph } from './PopulationGraph';
import { BirthDeathGraph } from './BirthDeathGraph';
import { PopulationPieChart } from './PopulationPieChart';
import { PlanktonSvg } from '../species/PlanktonSvg';
import { SardineSvg } from '../species/SardineSvg';
import { SharkSvg } from '../species/SharkSvg';
import { CrabSvg } from '../species/CrabSvg';
import type { SimulationState } from '../../types/simulation.types';

interface StatsPanelProps {
  state: SimulationState;
}

const SPECIES_BADGES = [
  { key: 'plankton', Icon: PlanktonSvg, color: '#7ec8a0' },
  { key: 'sardine',  Icon: SardineSvg,  color: '#89b4d8' },
  { key: 'shark',    Icon: SharkSvg,    color: '#8899aa' },
  { key: 'crab',     Icon: CrabSvg,     color: '#e07b39' },
] as const;

const INIT_RIGHT = 16;
const INIT_TOP = 80;

export function StatsPanel({ state }: StatsPanelProps) {
  const [pos, setPos] = useState({ right: INIT_RIGHT, top: INIT_TOP });
  const dragState = useRef<{ startX: number; startY: number; origRight: number; origTop: number } | null>(null);
  const latestCounts = state.populationHistory[state.populationHistory.length - 1];

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setPos({
        right: Math.max(0, dragState.current.origRight - dx),
        top: Math.max(64, dragState.current.origTop + dy),
      });
    };
    const onUp = () => { dragState.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startY: e.clientY, origRight: pos.right, origTop: pos.top };
  };

  const panelHeight = `calc(100vh - ${pos.top}px - 72px)`;

  return (
    <div
      data-testid="stats-panel"
      style={{
        position: 'fixed',
        right: pos.right,
        top: pos.top,
        width: 320,
        height: panelHeight,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0,180,216,0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,180,216,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleDragStart}
        style={{
          flexShrink: 0,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          borderBottom: '1px solid rgba(0,180,216,0.15)',
          background: 'rgba(0,180,216,0.06)',
          userSelect: 'none',
        }}
      >
        <div style={{ width: 32, height: 4, borderRadius: 2, background: 'rgba(0,180,216,0.4)' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Section header */}
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0096c7', paddingTop: 4 }}>
          Population
        </div>

        {latestCounts && (
          <PopulationPieChart
            plankton={latestCounts.plankton}
            sardine={latestCounts.sardine}
            shark={latestCounts.shark}
            crab={latestCounts.crab}
          />
        )}

        <div style={{ borderTop: '1px solid rgba(0,180,216,0.15)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0096c7' }}>
            Trends
          </div>
          <PopulationGraph data={state.populationHistory} />
          <BirthDeathGraph birthsData={state.birthsHistory} deathsData={state.deathsHistory} />
        </div>
      </div>
    </div>
  );
}
