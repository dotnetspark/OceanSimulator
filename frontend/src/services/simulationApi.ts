import type { SimulationConfig, SnapshotResult, OceanGrid } from '../types/simulation.types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const simulationApi = {
  initialize: (config: SimulationConfig): Promise<OceanGrid> =>
    fetch(`${API_BASE}/api/simulation/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).then(r => r.json()),

  runSnapshot: (): Promise<SnapshotResult> =>
    fetch(`${API_BASE}/api/simulation/snapshot`, { method: 'POST' }).then(r => r.json()),

  runNSnapshots: (n: number): Promise<SnapshotResult> =>
    fetch(`${API_BASE}/api/simulation/snapshots/${n}`, { method: 'POST' }).then(r => r.json()),

  runUntilExtinction: (target: string): Promise<SnapshotResult> =>
    fetch(`${API_BASE}/api/simulation/run/extinction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target })
    }).then(r => r.json()),

  runUntilEvent: (): Promise<SnapshotResult> =>
    fetch(`${API_BASE}/api/simulation/run/event`, { method: 'POST' }).then(r => r.json()),

  getState: (): Promise<SnapshotResult> =>
    fetch(`${API_BASE}/api/simulation/state`).then(r => r.json()),

  saveState: (): Promise<Blob> =>
    fetch(`${API_BASE}/api/simulation/save`, { method: 'POST' }).then(r => r.blob()),

  loadState: (file: File): Promise<SnapshotResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/api/simulation/load`, { method: 'POST', body: formData }).then(r => r.json());
  }
};
