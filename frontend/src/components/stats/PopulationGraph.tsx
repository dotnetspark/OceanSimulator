import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';

interface PopulationGraphProps {
  data: Array<{ snapshot: number; plankton: number; sardine: number; shark: number; crab: number }>;
}

export function PopulationGraph({ data }: PopulationGraphProps) {
  return (
    <div style={{ marginBottom: 16 }} data-testid="population-graph">
      <h3 style={{ color: palette.textMuted, fontSize: 12, marginBottom: 8 }}>POPULATION OVER TIME</h3>
      
      {/* Prey chart */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: palette.textMuted, marginLeft: 4 }}>PREY</span>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="snapshot" tick={{ fill: palette.textMuted, fontSize: 9 }} hide />
            <YAxis tick={{ fill: palette.textMuted, fontSize: 9 }} />
            <Tooltip contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }} />
            <Area type="monotone" dataKey="plankton" stroke={palette.plankton} fill={palette.plankton} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="sardine" stroke={palette.sardine} fill={palette.sardine} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Predators chart */}
      <div>
        <span style={{ fontSize: 10, color: palette.textMuted, marginLeft: 4 }}>PREDATORS</span>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 15 }}>
            <XAxis 
              dataKey="snapshot" 
              tick={{ fill: palette.textMuted, fontSize: 9 }} 
              label={{ value: 'Snapshot #', position: 'insideBottom', offset: -5, fill: palette.textMuted, fontSize: 9 }}
            />
            <YAxis tick={{ fill: palette.textMuted, fontSize: 9 }} />
            <Tooltip contentStyle={{ background: palette.panelBg, border: `1px solid ${palette.accent}`, fontSize: 11 }} />
            <Area type="monotone" dataKey="shark" stroke={palette.shark} fill={palette.shark} fillOpacity={0.15} strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="crab" stroke={palette.crab} fill={palette.crab} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
