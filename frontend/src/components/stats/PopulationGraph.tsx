import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';

interface PopulationGraphProps {
  data: Array<{ snapshot: number; plankton: number; sardine: number; shark: number; crab: number }>;
}

export function PopulationGraph({ data }: PopulationGraphProps) {
  const chartData = data.map(d => {
    const totalPopulation = d.plankton + d.sardine + d.shark + d.crab;
    const preyCount = d.sardine + d.plankton;
    return {
      snapshot: d.snapshot,
      predatorPressure: totalPopulation > 0 ? d.shark / (preyCount + 0.001) : 0,
      preyAbundance: totalPopulation > 0 ? preyCount / totalPopulation : 0,
    };
  });

  if (chartData.length === 0) {
    return (
      <div style={{ marginBottom: 16 }} data-testid="population-graph">
        <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 4 }}>🌊 ECOSYSTEM BALANCE</h3>
        <div style={{ fontSize: 10, color: palette.textMuted, marginBottom: 12 }}>
          Predator pressure vs prey abundance over time
        </div>
        <div style={{ 
          height: 160, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: palette.textMuted,
          fontSize: 11,
        }}>
          Run snapshots to see ecosystem balance emerge.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }} data-testid="population-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 4 }}>🌊 ECOSYSTEM BALANCE</h3>
      <div style={{ fontSize: 10, color: palette.textMuted, marginBottom: 12 }}>
        Predator pressure vs prey abundance over time
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="snapshot" 
            tick={{ fill: palette.textMuted, fontSize: 9 }} 
          />
          <YAxis 
            tick={{ fill: palette.textMuted, fontSize: 9 }} 
            domain={[0, 'auto']}
          />
          <Tooltip 
            contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Line 
            type="monotone" 
            dataKey="predatorPressure" 
            stroke={palette.shark} 
            strokeWidth={2} 
            dot={false}
            name="Predator Pressure"
          />
          <Line 
            type="monotone" 
            dataKey="preyAbundance" 
            stroke={palette.plankton} 
            strokeWidth={2} 
            dot={false}
            name="Prey Abundance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
