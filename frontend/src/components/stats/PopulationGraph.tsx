import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';

interface PopulationGraphProps {
  data: Array<{ snapshot: number; plankton: number; sardine: number; shark: number; crab: number }>;
}

const SPECIES = [
  { key: 'plankton', label: 'Plankton', emoji: '🦐', color: palette.plankton },
  { key: 'sardine',  label: 'Sardine',  emoji: '🐟', color: palette.sardine },
  { key: 'shark',    label: 'Shark',    emoji: '🦈', color: palette.shark },
  { key: 'crab',     label: 'Crab',     emoji: '🦀', color: palette.crab },
] as const;

export function PopulationGraph({ data }: PopulationGraphProps) {
  if (data.length === 0) {
    return (
      <div style={{ marginBottom: 16 }} data-testid="population-graph">
        <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 4 }}>🌊 POPULATION TRENDS</h3>
        <div style={{ 
          height: 160, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: palette.textMuted,
          fontSize: 11,
        }}>
          Run snapshots to see population trends.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }} data-testid="population-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 8 }}>🌊 POPULATION TRENDS</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="snapshot" tick={{ fill: palette.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: palette.textMuted, fontSize: 9 }} domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }}
            labelFormatter={(label) => `Snapshot ${label}`}
          />
          {SPECIES.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* emoji species legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 8 }}>
        {SPECIES.map(({ key, label, color, emoji }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 14 }}>{emoji}</span>
            <span style={{ fontSize: 11, color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
