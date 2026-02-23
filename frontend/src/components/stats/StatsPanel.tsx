import { PopulationGraph } from './PopulationGraph';
import { BirthDeathGraph } from './BirthDeathGraph';
import { palette } from '../../styles/palette';
import { SimulationState } from '../../types/simulation.types';

export function StatsPanel({ state }: { state: SimulationState }) {
  const latestCounts = state.populationHistory[state.populationHistory.length - 1];
  
  return (
    <div className="stats-panel p-6 space-y-6" data-testid="stats-panel">
      <div>
        <h2 className="text-2xl font-bold">Ocean Statistics</h2>
        <div className="snapshot-badge" style={{ color: palette.accent, fontSize: 13, marginTop: 4 }}>
          Snapshot #{state.snapshotNumber}
        </div>
      </div>
      
      {latestCounts && (
        <div className="population-counts">
          <h3 className="text-xl font-semibold mb-3">Current Population</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {(['plankton', 'sardine', 'shark', 'crab'] as const).map(species => (
              <div key={species} data-testid={`count-${species}`} style={{ background: palette.panelBg, borderRadius: 6, padding: '8px 10px', borderLeft: `3px solid ${palette[species]}` }}>
                <div style={{ fontSize: 11, color: palette.textMuted, textTransform: 'capitalize' }}>{species}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: palette[species] }}>{latestCounts[species]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="graphs border-t border-gray-700 pt-6 space-y-4">
        <PopulationGraph data={state.populationHistory} />
        <BirthDeathGraph birthsData={state.birthsHistory} deathsData={state.deathsHistory} />
      </div>
    </div>
  );
}
