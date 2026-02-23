import { useState, useRef, useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { useGridDiff } from './hooks/useGridDiff';
import { ConfigPanel } from './components/controls/ConfigPanel';
import { SimulationControls } from './components/controls/SimulationControls';
import { OceanGrid } from './components/grid/OceanGrid';
import { StatsPanel } from './components/stats/StatsPanel';
import type { SimulationConfig } from './types/simulation.types';
import './App.css';

const BG = '#0a1628';
const PANEL_BG = '#0f1f3d';
const BORDER = 'rgba(0,180,216,0.2)';
const ACCENT = '#00b4d8';

function App() {
  const sim = useSimulation();
  const changedCells = useGridDiff(sim.state.grid);
  const [started, setStarted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const loadFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  const handleStart = async (config: SimulationConfig) => {
    setApiError(null);
    try {
      await sim.initializeOcean(config);
      setStarted(true);
    } catch {
      setApiError('Cannot reach the backend at http://localhost:5030. Make sure the C# API is running.');
    }
  };

  const handleReset = () => {
    setStarted(false);
    setApiError(null);
    setMenuOpen(false);
  };

  const handleSave = () => {
    setMenuOpen(false);
    void sim.saveState();
  };

  const handleLoadClick = () => {
    setMenuOpen(false);
    loadFileRef.current?.click();
  };

  const controls = (
    <SimulationControls
      isRunning={sim.state.isRunning}
      onRunOne={sim.runSnapshot}
      onRunN={sim.runNSnapshots}
      onRunUntilExtinction={sim.runUntilExtinction}
      onRunUntilEvent={sim.runUntilEvent}
    />
  );

  return (
    <div className="min-h-screen bg-[#0a1628] text-[#e8f4f8] font-[system-ui,sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-6 border-b border-[rgba(0,180,216,0.2)] bg-[#0f1f3d] relative z-10">
        <span className="text-xl font-bold text-[#00b4d8] tracking-[-0.5px]">
          🌊 Ocean Simulator
        </span>
        <div className="flex items-center gap-4">
          {started && (
            <span className="text-[13px] text-[#7a9bb5]">
              Snapshot <span className="text-[#00b4d8] font-semibold">#{sim.state.snapshotNumber}</span>
            </span>
          )}
          {started && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Open menu"
                className="bg-transparent border border-[rgba(0,180,216,0.2)] rounded-md text-[#e8f4f8] cursor-pointer px-3 py-[5px] text-lg leading-none"
              >
                ☰
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] bg-[#0d1e38] border border-[rgba(0,180,216,0.2)] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.5)] min-w-[200px] z-[100] overflow-hidden">
                  {[
                    { icon: '🌊', label: 'New Simulation', action: handleReset,     testId: 'menu-new'  },
                    { icon: '💾', label: 'Save State',     action: handleSave,      testId: 'menu-save' },
                    { icon: '📂', label: 'Load State',     action: handleLoadClick, testId: 'menu-load' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      data-testid={item.testId}
                      className="flex items-center gap-2.5 w-full py-[11px] px-4 bg-transparent border-none text-[#e8f4f8] text-sm cursor-pointer text-left hover:bg-[rgba(0,180,216,0.1)]"
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div className="h-px bg-[rgba(0,180,216,0.15)] my-1" />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full py-[11px] px-4 bg-transparent border-none text-[#7a9bb5] text-sm cursor-pointer text-left hover:bg-[rgba(0,180,216,0.05)]"
                  >
                    <span className="text-base">ℹ️</span>
                    About — v1.0.0
                  </button>
                </div>
              )}
              <input
                ref={loadFileRef}
                type="file"
                accept=".json"
                onChange={e => { const f = e.target.files?.[0]; if (f) void sim.loadState(f); }}
                className="hidden"
                data-testid="input-load-file"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      {apiError && (
        <div className="m-6 p-4 px-5 bg-[rgba(183,28,28,0.15)] border border-[rgba(183,28,28,0.5)] rounded-[10px] text-[#ff8a80] text-sm flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="font-semibold mb-1">Backend not reachable</div>
            <div className="text-[#ffcdd2]">Start the C# API: <code className="bg-[rgba(0,0,0,0.3)] px-1.5 py-0.5 rounded">cd backend/OceanSimulator.Api && dotnet run --profile http</code></div>
          </div>
        </div>
      )}
      {!started ? (
        <ConfigPanel onStart={handleStart} />
      ) : (
        <div className="grid h-[calc(100vh-56px)]" style={{ gridTemplateColumns: '65fr 35fr' }}>
          {/* Left: ocean grid — full height, no controls below */}
          <div className="flex flex-col overflow-hidden border-r border-[rgba(0,180,216,0.1)]" data-testid="left-panel">
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-[#0a1628]">
              {sim.state.grid
                ? <OceanGrid grid={sim.state.grid} changedCells={changedCells} />
                : <div className="text-center text-[#7a9bb5]">
                    <div className="text-5xl mb-3">🌊</div>
                    <div className="text-sm">Waiting for ocean data…</div>
                    <div className="text-xs mt-1.5 text-[#3a5570]">Make sure the backend is running on port 5030</div>
                  </div>
              }
            </div>
          </div>
          {/* Right: stats + controls at bottom */}
          <div className="overflow-auto bg-[#0f1f3d] flex flex-col" data-testid="right-panel">
            <StatsPanel state={sim.state} controls={controls} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
