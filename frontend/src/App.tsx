import { useState } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { ConfigPanel } from './components/controls/ConfigPanel';
import { SimulationControls } from './components/controls/SimulationControls';
import { OceanGrid } from './components/grid/OceanGrid';
import { StatsPanel } from './components/stats/StatsPanel';
import type { SimulationConfig } from './types/simulation.types';
import './App.css';

function App() {
  const sim = useSimulation();
  const [started, setStarted] = useState(false);

  const handleStart = async (config: SimulationConfig) => {
    await sim.initializeOcean(config);
    setStarted(true);
  };

  return (
    <div className="app-layout min-h-screen bg-gray-900 text-white">
      {!started ? (
        <ConfigPanel onStart={handleStart} />
      ) : (
        <div className="simulation-layout grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="left-panel space-y-4" data-testid="left-panel">
            <div className="grid-container bg-gray-800 rounded-lg p-4 flex justify-center">
              {sim.state.grid && <OceanGrid grid={sim.state.grid} />}
            </div>
            <div className="controls-container bg-gray-800 rounded-lg">
              <SimulationControls
                snapshotNumber={sim.state.snapshotNumber}
                isRunning={sim.state.isRunning}
                onRunOne={sim.runSnapshot}
                onRunN={sim.runNSnapshots}
                onRunUntilExtinction={sim.runUntilExtinction}
                onRunUntilEvent={sim.runUntilEvent}
                onSave={sim.saveState}
                onLoad={sim.loadState}
              />
            </div>
          </div>
          <div className="right-panel bg-gray-800 rounded-lg" data-testid="right-panel">
            <StatsPanel state={sim.state} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
