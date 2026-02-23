import type { ReactNode } from 'react';
import { PopulationGraph } from './PopulationGraph';
import { BirthDeathGraph } from './BirthDeathGraph';
import { PopulationPieChart } from './PopulationPieChart';
import type { SimulationState } from '../../types/simulation.types';

interface StatsPanelProps {
  state: SimulationState;
  controls?: ReactNode;
}

export function StatsPanel({ state, controls }: StatsPanelProps) {
  const latestCounts = state.populationHistory[state.populationHistory.length - 1];

  return (
    <div className="p-5 flex flex-col gap-5 flex-1" data-testid="stats-panel">
      {/* Population pie chart */}
      {latestCounts && (
        <PopulationPieChart
          plankton={latestCounts.plankton}
          sardine={latestCounts.sardine}
          shark={latestCounts.shark}
          crab={latestCounts.crab}
        />
      )}

      {/* Graphs */}
      <div className="border-t border-white/[0.07] pt-4 flex flex-col gap-4">
        <PopulationGraph data={state.populationHistory} />
        <BirthDeathGraph birthsData={state.birthsHistory} deathsData={state.deathsHistory} />
      </div>

      {/* Simulation controls — pinned to bottom of stats panel */}
      {controls && (
        <div className="mt-auto">
          {controls}
        </div>
      )}
    </div>
  );
}
