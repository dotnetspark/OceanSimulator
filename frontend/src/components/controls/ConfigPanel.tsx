import { useState } from 'react';
import type { SimulationConfig } from '../../types/simulation.types';

interface ConfigPanelProps {
  onStart: (config: SimulationConfig) => void;
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

  const handleChange = (field: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <div className="config-panel p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ocean Simulator Configuration</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-xl font-semibold px-2">Grid Dimensions</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Rows:</span>
              <input
                type="number"
                value={config.rows}
                onChange={e => handleChange('rows', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={5}
                max={100}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Columns:</span>
              <input
                type="number"
                value={config.cols}
                onChange={e => handleChange('cols', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={5}
                max={100}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-xl font-semibold px-2">Initial Populations</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Plankton:</span>
              <input
                type="number"
                value={config.initialPlankton}
                onChange={e => handleChange('initialPlankton', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={0}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Sardines:</span>
              <input
                type="number"
                value={config.initialSardines}
                onChange={e => handleChange('initialSardines', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={0}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Sharks:</span>
              <input
                type="number"
                value={config.initialSharks}
                onChange={e => handleChange('initialSharks', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={0}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Crabs:</span>
              <input
                type="number"
                value={config.initialCrabs}
                onChange={e => handleChange('initialCrabs', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={0}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Reefs:</span>
              <input
                type="number"
                value={config.initialReefs}
                onChange={e => handleChange('initialReefs', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={0}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-xl font-semibold px-2">Breeding Thresholds</legend>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Plankton:</span>
              <input
                type="number"
                value={config.planktonBreedingThreshold}
                onChange={e => handleChange('planktonBreedingThreshold', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={1}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Sardine:</span>
              <input
                type="number"
                value={config.sardineBreedingThreshold}
                onChange={e => handleChange('sardineBreedingThreshold', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={1}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Shark:</span>
              <input
                type="number"
                value={config.sharkBreedingThreshold}
                onChange={e => handleChange('sharkBreedingThreshold', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={1}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-xl font-semibold px-2">Energy Thresholds</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Sardine:</span>
              <input
                type="number"
                value={config.sardineEnergyThreshold}
                onChange={e => handleChange('sardineEnergyThreshold', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={1}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Shark:</span>
              <input
                type="number"
                value={config.sharkEnergyThreshold}
                onChange={e => handleChange('sharkEnergyThreshold', parseInt(e.target.value))}
                className="px-3 py-2 border rounded bg-gray-800 text-white"
                min={1}
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold text-lg"
        >
          Start Simulation
        </button>
      </form>
    </div>
  );
}
