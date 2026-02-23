export type SpecimenType = 'Water' | 'Reef' | 'Plankton' | 'Sardine' | 'Shark' | 'Crab' | 'DeadSardine' | 'DeadShark';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  position: Position;
  specimenType: SpecimenType;
  specimenId?: string;
}

export interface OceanGrid {
  rows: number;
  cols: number;
  cells: Cell[][];
}

export interface PopulationCounts {
  plankton: number;
  sardine: number;
  shark: number;
  crab: number;
  deadSardine: number;
  deadShark: number;
}

export interface SnapshotResult {
  snapshotNumber: number;
  populationCounts: PopulationCounts;
  totalBirths: number;
  totalDeaths: number;
  isExtinctionReached: boolean;
  grid: OceanGrid;
}

export interface SimulationConfig {
  rows: number;
  cols: number;
  initialPlankton: number;
  initialSardines: number;
  initialSharks: number;
  initialCrabs: number;
  initialReefs: number;
  sardineBreedingThreshold: number;
  sharkBreedingThreshold: number;
  planktonBreedingThreshold: number;
  sardineEnergyThreshold: number;
  sharkEnergyThreshold: number;
  seed?: number;
}

export interface SimulationState {
  isRunning: boolean;
  snapshotNumber: number;
  grid: OceanGrid | null;
  populationHistory: Array<{ snapshot: number } & PopulationCounts>;
  birthsHistory: Array<{ snapshot: number; births: number }>;
  deathsHistory: Array<{ snapshot: number; deaths: number }>;
  config: SimulationConfig;
}

export type OceanEvent =
  | { type: 'SpecimenMoved'; specimenId: string; specimenType: SpecimenType; from: Position; to: Position }
  | { type: 'SpecimenBorn'; specimenId: string; specimenType: SpecimenType; position: Position }
  | { type: 'SpecimenDied'; specimenId: string; specimenType: SpecimenType; position: Position; cause: string }
  | { type: 'SnapshotCompleted'; snapshotResult: SnapshotResult };

export interface EnergyData {
  snapshot: number;
  planktonAvg: number;
  sardineAvg: number;
  sharkAvg: number;
  crabAvg: number;
}

export type RunMode = 'single' | 'n' | 'extinction' | 'event';

export type ExtinctionTarget = 'plankton' | 'sardine' | 'shark' | 'crab' | 'all';
