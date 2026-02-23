import { PopulationGraph } from './PopulationGraph';
import { BirthDeathGraph } from './BirthDeathGraph';
import { palette } from '../../styles/palette';
import { SimulationState } from '../../types/simulation.types';

export function StatsPanel({ state }: { state: SimulationState }) {
  const latestCounts = state.populationHistory[state.populationHistory.length - 1];
  
  return (
    <div className="stats-panel">
      <h2>Ocean Statistics</h2>
      <div className="snapshot-badge" style={{ color: palette.accent, fontSize: 13, marginBottom: 12 }}>
        Snapshot #{state.snapshotNumber}
      </div>
      
      {/* Current population counts */}
      {latestCounts && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {(['plankton', 'sardine', 'shark', 'crab'] as const).map(species => (
            <div key={species} style={{ background: palette.panelBg, borderRadius: 6, padding: '8px 10px', borderLeft: `3px solid ${palette[species]}` }}>
              <div style={{ fontSize: 11, color: palette.textMuted, textTransform: 'capitalize' }}>{species}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: palette[species] }}>{latestCounts[species]}</div>
            </div>
          ))}
        </div>
      )}
      
      <PopulationGraph data={state.populationHistory} />
      <BirthDeathGraph birthsData={state.birthsHistory} deathsData={state.deathsHistory} />
    </div>
  );
}
