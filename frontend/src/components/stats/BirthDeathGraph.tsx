import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { palette } from '../../styles/palette';

interface BirthDeathGraphProps {
  birthsData: Array<{ snapshot: number; births: number }>;
  deathsData: Array<{ snapshot: number; deaths: number }>;
}

export function BirthDeathGraph({ birthsData, deathsData }: BirthDeathGraphProps) {
  const data = birthsData.map((b, i) => {
    const deaths = deathsData[i]?.deaths ?? 0;
    const net = b.births - deaths;
    return {
      snapshot: b.snapshot,
      net,
    };
  });

  if (data.length === 0) {
    return (
      <div style={{ marginBottom: 16 }} data-testid="birth-death-graph">
        <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 4 }}>📈 POPULATION PULSE</h3>
        <div style={{ fontSize: 10, color: palette.textMuted, marginBottom: 12 }}>
          Net population change per snapshot (births − deaths)
        </div>
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
    <div style={{ marginBottom: 16 }} data-testid="birth-death-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 4 }}>📈 POPULATION PULSE</h3>
      <div style={{ fontSize: 10, color: palette.textMuted, marginBottom: 12 }}>
        Net population change per snapshot (births − deaths)
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="snapshot" tick={{ fill: palette.textMuted, fontSize: 10 }} />
          <YAxis tick={{ fill: palette.textMuted, fontSize: 10 }} domain={['auto', 'auto']} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          <Tooltip 
            contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }} 
            formatter={(value: number | undefined) => {
              if (value == null) return '';
              const n = Math.abs(value);
              return value > 0 ? `+${n} new` : value < 0 ? `−${n} lost` : '0';
            }}
            labelFormatter={(label) => `Snapshot ${label}`}
          />
          <Bar dataKey="net" radius={2}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.net > 0 ? palette.success : entry.net < 0 ? palette.buttonDanger : palette.textMuted} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
