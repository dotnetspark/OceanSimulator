import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';

interface PopulationGraphProps {
  data: Array<{ snapshot: number; plankton: number; sardine: number; shark: number; crab: number }>;
}

export function PopulationGraph({ data }: PopulationGraphProps) {
  return (
    <div style={{ marginBottom: 16 }} data-testid="population-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 8 }}>POPULATION OVER TIME</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="snapshot" tick={{ fill: palette.textMuted, fontSize: 10 }} />
          <YAxis tick={{ fill: palette.textMuted, fontSize: 10 }} />
          <Tooltip contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="plankton" stroke={palette.plankton} dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="sardine" stroke={palette.sardine} dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="shark" stroke={palette.shark} dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="crab" stroke={palette.crab} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
