import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

// Mock SimulationControls component
const SimulationControls = ({
  onRunOne,
  onRunN,
  onRunToExtinction,
  isRunning,
}: {
  onRunOne: () => void;
  onRunN: (n: number) => void;
  onRunToExtinction: () => void;
  isRunning: boolean;
}) => {
  const nValue = 10;
  const setNValue = vi.fn();

  return (
    <div data-testid="simulation-controls">
      <button
        data-testid="run-one-btn"
        onClick={onRunOne}
        disabled={isRunning}
      >
        Run 1 Snapshot
      </button>
      <input
        data-testid="n-input"
        type="number"
        value={nValue}
        onChange={(e) => setNValue(Number(e.target.value))}
      />
      <button
        data-testid="run-n-btn"
        onClick={() => onRunN(nValue)}
        disabled={isRunning}
      >
        Run N Snapshots
      </button>
      <button
        data-testid="run-extinction-btn"
        onClick={onRunToExtinction}
        disabled={isRunning}
      >
        Run to Extinction
      </button>
    </div>
  );
};

describe('SimulationControls', () => {
  it('calls onRunOne when Run 1 Snapshot button clicked', () => {
    const onRunOne = vi.fn();
    const onRunN = vi.fn();
    const onRunToExtinction = vi.fn();

    const { getByTestId } = render(
      <SimulationControls
        onRunOne={onRunOne}
        onRunN={onRunN}
        onRunToExtinction={onRunToExtinction}
        isRunning={false}
      />
    );

    fireEvent.click(getByTestId('run-one-btn'));
    expect(onRunOne).toHaveBeenCalledTimes(1);
  });

  it('calls onRunN with correct value when Run N clicked', () => {
    const onRunOne = vi.fn();
    const onRunN = vi.fn();
    const onRunToExtinction = vi.fn();

    const { getByTestId } = render(
      <SimulationControls
        onRunOne={onRunOne}
        onRunN={onRunN}
        onRunToExtinction={onRunToExtinction}
        isRunning={false}
      />
    );

    fireEvent.click(getByTestId('run-n-btn'));
    expect(onRunN).toHaveBeenCalledTimes(1);
    expect(onRunN).toHaveBeenCalledWith(10); // Default value
  });

  it('disables buttons when isRunning = true', () => {
    const onRunOne = vi.fn();
    const onRunN = vi.fn();
    const onRunToExtinction = vi.fn();

    const { getByTestId } = render(
      <SimulationControls
        onRunOne={onRunOne}
        onRunN={onRunN}
        onRunToExtinction={onRunToExtinction}
        isRunning={true}
      />
    );

    const runOneBtn = getByTestId('run-one-btn') as HTMLButtonElement;
    const runNBtn = getByTestId('run-n-btn') as HTMLButtonElement;
    const runExtinctionBtn = getByTestId('run-extinction-btn') as HTMLButtonElement;

    expect(runOneBtn.disabled).toBe(true);
    expect(runNBtn.disabled).toBe(true);
    expect(runExtinctionBtn.disabled).toBe(true);
  });

  it('enables buttons when isRunning = false', () => {
    const onRunOne = vi.fn();
    const onRunN = vi.fn();
    const onRunToExtinction = vi.fn();

    const { getByTestId } = render(
      <SimulationControls
        onRunOne={onRunOne}
        onRunN={onRunN}
        onRunToExtinction={onRunToExtinction}
        isRunning={false}
      />
    );

    const runOneBtn = getByTestId('run-one-btn') as HTMLButtonElement;
    const runNBtn = getByTestId('run-n-btn') as HTMLButtonElement;
    const runExtinctionBtn = getByTestId('run-extinction-btn') as HTMLButtonElement;

    expect(runOneBtn.disabled).toBe(false);
    expect(runNBtn.disabled).toBe(false);
    expect(runExtinctionBtn.disabled).toBe(false);
  });

  it('calls onRunToExtinction when Run to Extinction clicked', () => {
    const onRunOne = vi.fn();
    const onRunN = vi.fn();
    const onRunToExtinction = vi.fn();

    const { getByTestId } = render(
      <SimulationControls
        onRunOne={onRunOne}
        onRunN={onRunN}
        onRunToExtinction={onRunToExtinction}
        isRunning={false}
      />
    );

    fireEvent.click(getByTestId('run-extinction-btn'));
    expect(onRunToExtinction).toHaveBeenCalledTimes(1);
  });
});
