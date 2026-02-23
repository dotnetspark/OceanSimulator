import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { palette } from '../../styles/palette';
import { PlanktonSvg, SardineSvg, SharkSvg, CrabSvg } from '../species';

interface PopulationPieChartProps {
  plankton: number;
  sardine: number;
  shark: number;
  crab: number;
}

const SPECIES_CONFIG = [
  { key: 'plankton', label: 'Plankton', color: palette.plankton, Icon: PlanktonSvg },
  { key: 'sardine', label: 'Sardine', color: palette.sardine, Icon: SardineSvg },
  { key: 'shark', label: 'Shark', color: palette.shark, Icon: SharkSvg },
  { key: 'crab', label: 'Crab', color: palette.crab, Icon: CrabSvg },
] as const;

function SpeciesLegend({ data }: { data: PopulationPieChartProps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      {SPECIES_CONFIG.map(({ key, label, color, Icon }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: palette.text,
          }}
          data-testid={`legend-${key}`}
        >
          <Icon size={16} animated={false} />
          <span style={{ color: palette.textMuted }}>{label}:</span>
          <span style={{ fontWeight: 600, color }}>{data[key]}</span>
        </div>
      ))}
    </div>
  );
}

export function PopulationPieChart({ plankton, sardine, shark, crab }: PopulationPieChartProps) {
  const total = plankton + sardine + shark + crab;
  
  const chartData = SPECIES_CONFIG.map(({ key, label, color }) => ({
    name: label,
    value: key === 'plankton' ? plankton : key === 'sardine' ? sardine : key === 'shark' ? shark : crab,
    color,
  })).filter(item => item.value > 0);

  return (
    <div data-testid="population-pie-chart">
      <div style={{ fontSize: 11, fontWeight: 600, color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
        Population
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: palette.panelBg,
                  border: `1px solid ${palette.accent}`,
                  fontSize: 11,
                  borderRadius: 4,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label showing total */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: palette.text, lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 9, color: palette.textMuted, textTransform: 'uppercase' }}>total</div>
          </div>
        </div>
        <SpeciesLegend data={{ plankton, sardine, shark, crab }} />
      </div>
    </div>
  );
}
