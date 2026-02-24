import { useReducer } from 'react';
import type { SimulationConfig, SimulationState, SnapshotResult, OceanGrid } from '../types/simulation.types';
import { simulationApi } from '../services/simulationApi';

type SimulationAction =
  | { type: 'INITIALIZED'; grid: OceanGrid; config: SimulationConfig }
  | { type: 'SNAPSHOT_COMPLETED'; result: SnapshotResult }
  | { type: 'SNAPSHOT_PROGRESS'; result: SnapshotResult }
  | { type: 'RUNNING'; isRunning: boolean }
  | { type: 'LOADED'; result: SnapshotResult };

const initialState: SimulationState = {
  isRunning: false,
  snapshotNumber: 0,
  grid: null,
  populationHistory: [],
  birthsHistory: [],
  deathsHistory: [],
  config: {
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
  }
};

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'INITIALIZED':
      return {
        ...initialState,
        grid: action.grid,
        config: action.config,
      };
    case 'SNAPSHOT_PROGRESS':
      return {
        ...state,
        snapshotNumber: action.result.snapshotNumber,
        grid: action.result.grid,
        populationHistory: [
          ...state.populationHistory,
          { snapshot: action.result.snapshotNumber, ...action.result.populationCounts }
        ],
        birthsHistory: [
          ...state.birthsHistory,
          { snapshot: action.result.snapshotNumber, births: action.result.totalBirths }
        ],
        deathsHistory: [
          ...state.deathsHistory,
          { snapshot: action.result.snapshotNumber, deaths: action.result.totalDeaths }
        ],
        isRunning: true,
      };
    case 'SNAPSHOT_COMPLETED':
      return {
        ...state,
        snapshotNumber: action.result.snapshotNumber,
        grid: action.result.grid,
        populationHistory: [
          ...state.populationHistory,
          { snapshot: action.result.snapshotNumber, ...action.result.populationCounts }
        ],
        birthsHistory: [
          ...state.birthsHistory,
          { snapshot: action.result.snapshotNumber, births: action.result.totalBirths }
        ],
        deathsHistory: [
          ...state.deathsHistory,
          { snapshot: action.result.snapshotNumber, deaths: action.result.totalDeaths }
        ],
        isRunning: false,
      };
    case 'RUNNING':
      return {
        ...state,
        isRunning: action.isRunning,
      };
    case 'LOADED':
      return {
        ...state,
        snapshotNumber: action.result.snapshotNumber,
        grid: action.result.grid,
        populationHistory: [
          { snapshot: action.result.snapshotNumber, ...action.result.populationCounts }
        ],
        isRunning: false,
      };
    default:
      return state;
  }
}

export function useSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  const initializeOcean = async (config: SimulationConfig) => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      const grid = await simulationApi.initialize(config);
      dispatch({ type: 'INITIALIZED', grid, config });
    } catch (error) {
      console.error('Failed to initialize:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
      throw error; // re-throw so App.tsx can show the error banner
    }
  };

  const runSnapshot = async () => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      const result = await simulationApi.runSnapshot();
      dispatch({ type: 'SNAPSHOT_COMPLETED', result });
    } catch (error) {
      console.error('Failed to run snapshot:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
    }
  };

  const runNSnapshots = async (n: number) => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      for (let i = 0; i < n; i++) {
        const result = await simulationApi.runSnapshot();
        if (i < n - 1) {
          dispatch({ type: 'SNAPSHOT_PROGRESS', result });
        } else {
          dispatch({ type: 'SNAPSHOT_COMPLETED', result });
        }
      }
    } catch (error) {
      console.error('Failed to run N snapshots:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
    }
  };

  const runUntilExtinction = async (target: string) => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      const result = await simulationApi.runUntilExtinction(target);
      dispatch({ type: 'SNAPSHOT_COMPLETED', result });
    } catch (error) {
      console.error('Failed to run until extinction:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
    }
  };

  const runUntilEvent = async () => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      const result = await simulationApi.runUntilEvent();
      dispatch({ type: 'SNAPSHOT_COMPLETED', result });
    } catch (error) {
      console.error('Failed to run until event:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
    }
  };

  const saveState = async () => {
    try {
      const blob = await simulationApi.saveState();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ocean-state-${state.snapshotNumber}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  };

  const loadState = async (file: File) => {
    dispatch({ type: 'RUNNING', isRunning: true });
    try {
      const result = await simulationApi.loadState(file);
      dispatch({ type: 'LOADED', result });
    } catch (error) {
      console.error('Failed to load state:', error);
      dispatch({ type: 'RUNNING', isRunning: false });
    }
  };

  return {
    state,
    initializeOcean,
    runSnapshot,
    runNSnapshots,
    runUntilExtinction,
    runUntilEvent,
    saveState,
    loadState
  };
}
