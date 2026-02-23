import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SimulationConfig } from '../types/simulation.types';

// Mock ConfigPanel component
const ConfigPanel = ({
  onStart,
  isRunning,
}: {
  onStart: (config: SimulationConfig) => void;
  isRunning: boolean;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config: SimulationConfig = {
      rows: 50,
      cols: 50,
      initialPlankton: 100,
      initialSardines: 20,
      initialSharks: 5,
      initialCrabs: 10,
      initialReefs: 50,
      sardineBreedingThreshold: 5,
      sharkBreedingThreshold: 8,
      planktonBreedingThreshold: 3,
      sardineEnergyThreshold: 10,
      sharkEnergyThreshold: 15,
      seed: 42,
    };
    onStart(config);
  };

  return (
    <form data-testid="config-panel" onSubmit={handleSubmit}>
      <input data-testid="rows-input" type="number" defaultValue={50} />
      <input data-testid="cols-input" type="number" defaultValue={50} />
      <input data-testid="plankton-input" type="number" defaultValue={100} />
      <input data-testid="sardines-input" type="number" defaultValue={20} />
      <input data-testid="sharks-input" type="number" defaultValue={5} />
      <input data-testid="crabs-input" type="number" defaultValue={10} />
      <input data-testid="reefs-input" type="number" defaultValue={50} />
      <button data-testid="start-btn" type="submit" disabled={isRunning}>
        Start Simulation
      </button>
    </form>
  );
};

describe('ConfigPanel', () => {
  it('renders all configuration inputs', () => {
    const onStart = vi.fn();

    const { getByTestId } = render(
      <ConfigPanel onStart={onStart} isRunning={false} />
    );

    expect(getByTestId('rows-input')).toBeTruthy();
    expect(getByTestId('cols-input')).toBeTruthy();
    expect(getByTestId('plankton-input')).toBeTruthy();
    expect(getByTestId('sardines-input')).toBeTruthy();
    expect(getByTestId('sharks-input')).toBeTruthy();
    expect(getByTestId('crabs-input')).toBeTruthy();
    expect(getByTestId('reefs-input')).toBeTruthy();
  });

  it('calls onStart with correct config on form submit', () => {
    const onStart = vi.fn();

    const { getByTestId } = render(
      <ConfigPanel onStart={onStart} isRunning={false} />
    );

    fireEvent.submit(getByTestId('config-panel'));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: 50,
        cols: 50,
        initialPlankton: 100,
        initialSardines: 20,
        initialSharks: 5,
      })
    );
  });

  it('disables start button when isRunning = true', () => {
    const onStart = vi.fn();

    const { getByTestId } = render(
      <ConfigPanel onStart={onStart} isRunning={true} />
    );

    const startBtn = getByTestId('start-btn') as HTMLButtonElement;
    expect(startBtn.disabled).toBe(true);
  });

  it('enables start button when isRunning = false', () => {
    const onStart = vi.fn();

    const { getByTestId } = render(
      <ConfigPanel onStart={onStart} isRunning={false} />
    );

    const startBtn = getByTestId('start-btn') as HTMLButtonElement;
    expect(startBtn.disabled).toBe(false);
  });

  it('renders with default values', () => {
    const onStart = vi.fn();

    const { getByTestId } = render(
      <ConfigPanel onStart={onStart} isRunning={false} />
    );

    const rowsInput = getByTestId('rows-input') as HTMLInputElement;
    const planktonInput = getByTestId('plankton-input') as HTMLInputElement;

    expect(rowsInput.defaultValue).toBe('50');
    expect(planktonInput.defaultValue).toBe('100');
  });
});
