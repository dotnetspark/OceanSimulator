import { useState, useRef, useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { useGridDiff } from './hooks/useGridDiff';
import { ConfigPanel } from './components/controls/ConfigPanel';
import { SimulationControls } from './components/controls/SimulationControls';
import { OceanGrid } from './components/grid/OceanGrid';
import { StatsPanel } from './components/stats/StatsPanel';
import type { SimulationConfig } from './types/simulation.types';
import './App.css';

function App() {
  const sim = useSimulation();
  const changedCells = useGridDiff(sim.state.grid);
  const [started, setStarted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 70, right: 16 });
  const loadFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
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



  return (
    <div className="h-screen bg-[#f5f8fc] text-[#0a1628] font-[system-ui,sans-serif] flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between h-16 px-6 border-b border-[rgba(0,180,216,0.2)] bg-[#0f1f3d] relative z-30 overflow-visible">
        <span className="shrink-0 whitespace-nowrap text-2xl font-bold text-[#00b4d8] tracking-[-0.5px]">
          🌊 Ocean Simulator
        </span>
        <div className="flex items-center gap-8 ml-4">
          {started && (
            <span className="text-sm text-[#7a9bb5]">
              Snapshot <span className="text-[#00b4d8] font-semibold">#{sim.state.snapshotNumber}</span>
            </span>
          )}
          {started && (
            <div ref={menuRef} className="relative">
              <button
                ref={hamburgerBtnRef}
                onClick={() => {
                  if (!menuOpen && hamburgerBtnRef.current) {
                    const rect = hamburgerBtnRef.current.getBoundingClientRect();
                    setDropdownPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
                  }
                  setMenuOpen(o => !o);
                }}
                aria-label="Open menu"
                className="bg-transparent border border-[rgba(0,180,216,0.2)] rounded-md text-[#e8f4f8] cursor-pointer px-4 py-2.5 text-xl leading-none min-w-[40px] min-h-[40px]"
              >
                ☰
              </button>
              {menuOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    right: dropdownPos.right,
                    zIndex: 1000,
                    background: '#ffffff',
                    border: '1px solid rgba(0,180,216,0.25)',
                    borderRadius: 10,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    minWidth: 200,
                    overflow: 'hidden',
                  }}
                >
                  {[
                    { icon: '🌊', label: 'New Simulation', action: handleReset,     testId: 'menu-new'  },
                    { icon: '💾', label: 'Save State',     action: handleSave,      testId: 'menu-save' },
                    { icon: '📂', label: 'Load State',     action: handleLoadClick, testId: 'menu-load' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      data-testid={item.testId}
                      className="flex items-center gap-2.5 w-full py-3 px-4 bg-transparent border-none text-[#0a1628] text-sm cursor-pointer text-left hover:bg-[rgba(0,180,216,0.08)]"
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div className="h-px bg-[rgba(0,180,216,0.15)] my-1" />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full py-3 px-4 bg-transparent border-none text-[#5a7a96] text-sm cursor-pointer text-left hover:bg-[rgba(0,180,216,0.05)]"
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
        <>
          <div className="relative flex-1 min-h-0 w-full overflow-hidden">
            {/* Ocean grid — full size */}
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4 bg-[#f0f5fa]" data-testid="simulation-view">
              {sim.state.grid
                ? <OceanGrid grid={sim.state.grid} changedCells={changedCells} />
                : <div className="text-center text-[#7a9bb5]">
                    <div className="text-5xl mb-3">🌊</div>
                    <div className="text-sm">Waiting for ocean data…</div>
                    <div className="text-xs mt-1.5 text-[#3a5570]">Make sure the backend is running on port 5030</div>
                  </div>
              }
            </div>
            {/* Stats panel — floating glass overlay */}
            <StatsPanel state={sim.state} />
          </div>
          {/* Bottom footer — in-flow flex child */}
          <footer className="shrink-0 relative z-20 h-14 flex items-center bg-white border-t border-[#d0dde8]">
            <SimulationControls
              variant="footer"
              isRunning={sim.state.isRunning}
              onRunOne={sim.runSnapshot}
              onRunN={sim.runNSnapshots}
              onRunUntilExtinction={sim.runUntilExtinction}
              onRunUntilEvent={sim.runUntilEvent}
            />
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
