import { useState, useRef } from 'react';

const PANEL_BG = '#ffffff';
const BORDER = '#d0dde8';

interface SimulationControlsProps {
  isRunning: boolean;
  onRunOne: () => void;
  onRunN: (n: number) => void;
  onRunUntilExtinction: (target: string) => void;
  onRunUntilEvent: () => void;
  variant?: 'sidebar' | 'footer';
}

type BtnVariant = 'primary' | 'danger' | 'warning' | 'ghost';

function Btn({
  onClick, disabled, children, variant = 'ghost', testId,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: BtnVariant;
  testId?: string;
}) {
  const colors: Record<BtnVariant, { bg: string }> = {
    primary: { bg: '#0096c7' },
    danger:  { bg: '#b71c1c' },
    warning: { bg: '#e65100' },
    ghost:   { bg: PANEL_BG  },
  };
  const { bg } = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      style={{
        padding: '8px 14px',
        background: disabled ? '#edf0f5' : bg,
        border: `1px solid ${disabled ? BORDER : variant === 'ghost' ? BORDER : 'transparent'}`,
        borderRadius: 7,
        color: disabled ? '#a0b4c4' : variant === 'ghost' ? '#0a1628' : '#ffffff',
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transition: 'background 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold text-[#7a9bb5] uppercase tracking-[0.8px] mb-2">
      {children}
    </div>
  );
}

const SPECIES_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',      label: 'Any Species'  },
  { value: 'plankton', label: '🦐 Plankton'  },
  { value: 'sardine',  label: '🐟 Sardine'   },
  { value: 'shark',    label: '🦈 Shark'     },
  { value: 'crab',     label: '🦀 Crab'      },
];

export function SimulationControls({
  isRunning,
  onRunOne,
  onRunN,
  onRunUntilExtinction,
  onRunUntilEvent,
  variant = 'sidebar',
}: SimulationControlsProps) {
  const [nValue, setNValue] = useState(10);
  const [extinctionTarget, setExtinctionTarget] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Footer variant — horizontal layout
  if (variant === 'footer') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', padding: '8px 16px', width: '100%', overflowX: 'auto', alignSelf: 'center' } as React.CSSProperties}>
        {/* Running indicator */}
        {isRunning && (
          <div className="flex items-center gap-2 py-2 px-3 bg-[rgba(0,180,216,0.1)] rounded-[7px] border border-[rgba(0,180,216,0.3)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
            <span className="text-xs text-[#00b4d8] font-medium">Running…</span>
          </div>
        )}

        {/* Step controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Btn onClick={onRunOne} disabled={isRunning} variant="primary" testId="btn-run-one">
            ▶ Run 1
          </Btn>
          <input
            ref={inputRef}
            type="number"
            value={nValue}
            onChange={e => setNValue(parseInt(e.target.value) || 1)}
            disabled={isRunning}
            min={1} max={9999}
            data-testid="input-n"
            style={{ width: 52, padding: '7px 8px', background: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: 6, color: '#0a1628', fontSize: 13, textAlign: 'center' }}
          />
          <Btn onClick={() => onRunN(nValue)} disabled={isRunning} variant="primary" testId="btn-run-n">
            ▶▶ Run N
          </Btn>
        </div>

        {/* Auto-run controls */}
        <Btn onClick={onRunUntilEvent} disabled={isRunning} variant="warning" testId="btn-run-event">
          ⚡ Until Birth or Death
        </Btn>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select
            value={extinctionTarget}
            onChange={e => setExtinctionTarget(e.target.value)}
            disabled={isRunning}
            style={{ padding: '7px 10px', background: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: 6, color: '#0a1628', fontSize: 13 }}
          >
            {SPECIES_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Btn onClick={() => onRunUntilExtinction(extinctionTarget)} disabled={isRunning} variant="danger" testId="btn-run-extinction">
            💀 Run Until Extinct
          </Btn>
        </div>
      </div>
    );
  }

  // Sidebar variant — vertical layout (default)
  return (
    <div className="px-4 pt-4 pb-3 flex flex-col gap-3.5 border-t border-[#d0dde8]">
      {/* Running indicator */}
      {isRunning && (
        <div className="flex items-center gap-2 py-2 px-3 bg-[rgba(0,180,216,0.1)] rounded-[7px] border border-[rgba(0,180,216,0.3)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
          <span className="text-xs text-[#00b4d8] font-medium">Simulation running…</span>
        </div>
      )}

      {/* Step controls */}
      <div>
        <GroupLabel>Step</GroupLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn onClick={onRunOne} disabled={isRunning} variant="primary" testId="btn-run-one">
            ▶ Run 1
          </Btn>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="number"
              value={nValue}
              onChange={e => setNValue(parseInt(e.target.value) || 1)}
              disabled={isRunning}
              min={1} max={9999}
              data-testid="input-n"
              style={{ width: 52, padding: '7px 8px', background: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: 6, color: '#0a1628', fontSize: 13, textAlign: 'center' }}
            />
            <Btn onClick={() => onRunN(nValue)} disabled={isRunning} variant="primary" testId="btn-run-n">
              ▶▶ Run N
            </Btn>
          </div>
        </div>
      </div>

      {/* Auto-run controls */}
      <div>
        <GroupLabel>Auto-run</GroupLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn onClick={onRunUntilEvent} disabled={isRunning} variant="warning" testId="btn-run-event">
            ⚡ Until Birth or Death
          </Btn>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={extinctionTarget}
              onChange={e => setExtinctionTarget(e.target.value)}
              disabled={isRunning}
              style={{ padding: '7px 10px', background: '#ffffff', border: `1px solid ${BORDER}`, borderRadius: 6, color: '#0a1628', fontSize: 13, flex: '1 1 auto', minWidth: 0 }}
            >
              {SPECIES_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Btn onClick={() => onRunUntilExtinction(extinctionTarget)} disabled={isRunning} variant="danger" testId="btn-run-extinction">
              💀 Run Until Extinct
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
