import { useState, useRef } from 'react';

interface SimulationControlsProps {
  snapshotNumber: number;
  isRunning: boolean;
  onRunOne: () => void;
  onRunN: (n: number) => void;
  onRunUntilExtinction: (target: string) => void;
  onRunUntilEvent: () => void;
  onSave: () => void;
  onLoad: (file: File) => void;
}

export function SimulationControls({
  snapshotNumber,
  isRunning,
  onRunOne,
  onRunN,
  onRunUntilExtinction,
  onRunUntilEvent,
  onSave,
  onLoad,
}: SimulationControlsProps) {
  const [nValue, setNValue] = useState(10);
  const [extinctionTarget, setExtinctionTarget] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoad(file);
    }
  };

  return (
    <div className="simulation-controls p-4 space-y-4">
      <div className="text-xl font-semibold mb-4" data-testid="snapshot-number">
        Snapshot: {snapshotNumber}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRunOne}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white font-medium"
          data-testid="btn-run-one"
        >
          Run 1 Snapshot
        </button>

        <div className="flex gap-2">
          <input
            type="number"
            value={nValue}
            onChange={e => setNValue(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded bg-gray-800 text-white"
            min={1}
            disabled={isRunning}
            data-testid="input-n"
          />
          <button
            onClick={() => onRunN(nValue)}
            disabled={isRunning}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white font-medium"
            data-testid="btn-run-n"
          >
            Run N
          </button>
        </div>

        <div className="col-span-2 flex gap-2">
          <select
            value={extinctionTarget}
            onChange={e => setExtinctionTarget(e.target.value)}
            className="px-3 py-2 border rounded bg-gray-800 text-white"
            disabled={isRunning}
          >
            <option value="all">All Species</option>
            <option value="plankton">Plankton</option>
            <option value="sardine">Sardine</option>
            <option value="shark">Shark</option>
            <option value="crab">Crab</option>
          </select>
          <button
            onClick={() => onRunUntilExtinction(extinctionTarget)}
            disabled={isRunning}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-white font-medium"
            data-testid="btn-run-extinction"
          >
            Run Until Extinction
          </button>
        </div>

        <button
          onClick={onRunUntilEvent}
          disabled={isRunning}
          className="col-span-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded text-white font-medium"
          data-testid="btn-run-event"
        >
          Run Until Next Event
        </button>

        <button
          onClick={onSave}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-medium"
          data-testid="btn-save"
        >
          Save State
        </button>

        <button
          onClick={handleLoadClick}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-medium"
        >
          Load State
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          data-testid="input-load-file"
        />
      </div>

      {isRunning && (
        <div className="text-center text-yellow-400 font-medium">
          Running...
        </div>
      )}
    </div>
  );
}
