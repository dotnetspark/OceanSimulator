import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';

interface BirthDeathGraphProps {
  birthsData: Array<{ snapshot: number; births: number }>;
  deathsData: Array<{ snapshot: number; deaths: number }>;
}

export function BirthDeathGraph({ birthsData, deathsData }: BirthDeathGraphProps) {
  // Merge into combined array
  const data = birthsData.map((b, i) => ({
    snapshot: b.snapshot,
    births: b.births,
    deaths: deathsData[i]?.deaths ?? 0,
  }));
  
  return (
    <div style={{ marginBottom: 16 }} data-testid="birth-death-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 8 }}>BIRTHS & DEATHS PER SNAPSHOT</h3>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="snapshot" tick={{ fill: palette.textMuted, fontSize: 10 }} />
          <YAxis tick={{ fill: palette.textMuted, fontSize: 10 }} />
          <Tooltip contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="births" fill={palette.success} radius={[2,2,0,0]} />
          <Bar dataKey="deaths" fill={palette.buttonDanger} radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
