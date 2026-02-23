import { useState } from 'react';
import { PopulationGraph } from './PopulationGraph';
import { BirthDeathGraph } from './BirthDeathGraph';
import { PopulationPieChart } from './PopulationPieChart';
import type { SimulationState } from '../../types/simulation.types';

interface StatsPanelProps {
  state: SimulationState;
}

const SPECIES_BADGES = [
  { key: 'plankton', emoji: '🌿', color: '#2ecc71' },
  { key: 'sardine', emoji: '🐟', color: '#3498db' },
  { key: 'shark', emoji: '🦈', color: '#9b59b6' },
  { key: 'crab', emoji: '🦀', color: '#e67e22' },
] as const;

export function StatsPanel({ state }: StatsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const latestCounts = state.populationHistory[state.populationHistory.length - 1];

  return (
    <div
      className="absolute right-4 top-4 w-[320px] z-10"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
        opacity: isOpen ? 1 : 0,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
        maxHeight: 'calc(100vh - 140px)',
      }}
      data-testid="stats-panel"
    >
      {/* Collapse/expand toggle tab */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="absolute flex items-center justify-center cursor-pointer border border-[rgba(0,180,216,0.3)] text-[#00b4d8] text-xs font-medium tracking-wide"
        style={{
          left: '-36px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '80px',
          borderRadius: '8px 0 0 8px',
          background: 'rgba(10, 22, 40, 0.92)',
          backdropFilter: 'blur(12px)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
        aria-label={isOpen ? 'Collapse stats panel' : 'Expand stats panel'}
        data-testid="stats-toggle"
      >
        {isOpen ? '❮ Stats' : '📊'}
      </button>

      {/* Glass panel container */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: 'rgba(10, 22, 40, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 180, 216, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,216,0.1)',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
        }}
      >
        <div className="p-4 flex flex-col gap-4">
          {/* Species count badges — 2x2 grid */}
          {latestCounts && (
            <div className="grid grid-cols-2 gap-2">
              {SPECIES_BADGES.map(({ key, emoji, color }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color,
                  }}
                >
                  <span className="text-base">{emoji}</span>
                  <span>{latestCounts[key]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Section header */}
          <div
            className="text-[10px] font-semibold uppercase tracking-widest pt-2"
            style={{ color: 'rgba(0,180,216,0.7)' }}
          >
            Population
          </div>

          {/* Population pie chart */}
          {latestCounts && (
            <PopulationPieChart
              plankton={latestCounts.plankton}
              sardine={latestCounts.sardine}
              shark={latestCounts.shark}
              crab={latestCounts.crab}
            />
          )}

          {/* Divider + Graphs */}
          <div className="border-t border-white/[0.05] pt-3 flex flex-col gap-3">
            <div
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(0,180,216,0.7)' }}
            >
              Trends
            </div>
            <PopulationGraph data={state.populationHistory} />
            <BirthDeathGraph birthsData={state.birthsHistory} deathsData={state.deathsHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
