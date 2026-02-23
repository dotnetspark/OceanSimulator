import { useState } from 'react';
import type { SimulationConfig } from '../../types/simulation.types';

const BG = '#0a1628';
const PANEL_BG = '#0f1f3d';
const BORDER = '#1e4060';
const ACCENT = '#00b4d8';
const MUTED = '#7a9bb5';

const SPECIES = [
  { key: 'initialPlankton', label: 'Plankton', emoji: '🌿', color: '#7ec8a0', max: 200 },
  { key: 'initialSardines', label: 'Sardines', emoji: '🐟', color: '#89b4d8', max: 100 },
  { key: 'initialSharks', label: 'Sharks', emoji: '🦈', color: '#546e7a', max: 50 },
  { key: 'initialCrabs', label: 'Crabs', emoji: '🦀', color: '#e07b39', max: 50 },
  { key: 'initialReefs', label: 'Reefs', emoji: '🪸', color: '#8b7355', max: 100 },
] as const;

interface ConfigPanelProps {
  onStart: (config: SimulationConfig) => void;
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, max = 999 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(parseInt(e.target.value) || 0)}
      min={min}
      max={max}
      style={{
        width: 64,
        padding: '6px 8px',
        background: BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        color: '#e8f4f8',
        fontSize: 14,
        textAlign: 'center',
      }}
    />
  );
}

export function ConfigPanel({ onStart }: ConfigPanelProps) {
  const [config, setConfig] = useState<SimulationConfig>({
    rows: 20,
    cols: 20,
    initialPlankton: 50,
    initialSardines: 20,
    initialSharks: 10,
    initialCrabs: 5,
    initialReefs: 15,
    sardineBreedingThreshold: 4,
    sharkBreedingThreshold: 8,
    planktonBreedingThreshold: 3,
    sardineEnergyThreshold: 5,
    sharkEnergyThreshold: 8,
  });

  const set = (field: keyof SimulationConfig, value: number) =>
    setConfig(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌊</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#e8f4f8' }}>Configure Your Ocean</h1>
          <p style={{ margin: '8px 0 0', color: MUTED, fontSize: 15 }}>Set up the ecosystem before the simulation begins</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Grid dimensions */}
          <SectionCard title="Grid Size" icon="📐">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[{ field: 'rows' as const, label: 'Rows' }, { field: 'cols' as const, label: 'Columns' }].map(({ field, label }) => (
                <div key={field}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="range"
                      value={config[field]}
                      onChange={e => set(field, parseInt(e.target.value))}
                      min={5} max={60}
                      style={{ flex: 1, accentColor: ACCENT }}
                    />
                    <NumberInput
                      value={config[field]}
                      onChange={v => set(field, v)}
                      min={5} max={60}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Species populations */}
          <SectionCard title="Initial Populations" icon="🧬">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SPECIES.map(({ key, label, emoji, color, max }) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 72px', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span style={{ fontSize: 13, color: color, fontWeight: 500 }}>{label}</span>
                  </div>
                  <input
                    type="range"
                    value={config[key]}
                    onChange={e => set(key, parseInt(e.target.value))}
                    min={0} max={max}
                    style={{ accentColor: color }}
                  />
                  <NumberInput value={config[key]} onChange={v => set(key, v)} min={0} max={max} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Breeding thresholds */}
          <SectionCard title="Breeding Thresholds" icon="🥚">
            <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>How many moves before an organism reproduces</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { key: 'planktonBreedingThreshold' as const, label: 'Plankton', emoji: '🌿' },
                { key: 'sardineBreedingThreshold' as const, label: 'Sardine', emoji: '🐟' },
                { key: 'sharkBreedingThreshold' as const, label: 'Shark', emoji: '🦈' },
              ].map(({ key, label, emoji }) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{label}</div>
                  <NumberInput value={config[key]} onChange={v => set(key, v)} min={1} max={20} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Energy thresholds */}
          <SectionCard title="Energy Thresholds" icon="⚡">
            <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>Starting energy — organisms die when it reaches 0</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'sardineEnergyThreshold' as const, label: 'Sardine', emoji: '🐟' },
                { key: 'sharkEnergyThreshold' as const, label: 'Shark', emoji: '🦈' },
              ].map(({ key, label, emoji }) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{label}</div>
                  <NumberInput value={config[key]} onChange={v => set(key, v)} min={1} max={20} />
                </div>
              ))}
            </div>
          </SectionCard>

          <button
            type="submit"
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #0096c7, #00b4d8)',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 20px rgba(0, 180, 216, 0.3)',
            }}
          >
            🌊 Launch Simulation
          </button>
        </form>
      </div>
    </div>
  );
}
