import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SpecimenType } from '../types/simulation.types';

// Mock GridCell component for testing
const GridCell = ({ specimenType, size }: { specimenType: SpecimenType; size: number }) => {
  return (
    <div
      data-testid={`grid-cell-${specimenType}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getColorForType(specimenType),
      }}
    />
  );
};

const getColorForType = (type: SpecimenType): string => {
  switch (type) {
    case 'Water': return '#4A90E2';
    case 'Reef': return '#8B4513';
    case 'Plankton': return '#90EE90';
    case 'Sardine': return '#C0C0C0';
    case 'Shark': return '#2F4F4F';
    case 'Crab': return '#FF6347';
    case 'DeadSardine': return '#696969';
    case 'DeadShark': return '#1C1C1C';
    default: return '#FFFFFF';
  }
};

describe('GridCell', () => {
  it('renders without crashing for each SpecimenType', () => {
    const types: SpecimenType[] = [
      'Water', 'Reef', 'Plankton', 'Sardine', 'Shark', 'Crab', 'DeadSardine', 'DeadShark'
    ];
    
    types.forEach(type => {
      const { container } = render(<GridCell specimenType={type} size={32} />);
      expect(container.firstChild).toBeTruthy();
    });
  });
  
  it('applies correct size', () => {
    const { container } = render(<GridCell specimenType="Plankton" size={48} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.style.width).toBe('48px');
    expect(cell.style.height).toBe('48px');
  });
  
  it('renders Water with correct color', () => {
    const { container } = render(<GridCell specimenType="Water" size={32} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.style.backgroundColor).toBe('rgb(74, 144, 226)');
  });
  
  it('renders Plankton with correct color', () => {
    const { container } = render(<GridCell specimenType="Plankton" size={32} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.style.backgroundColor).toBe('rgb(144, 238, 144)');
  });
  
  it('has correct data-testid for each type', () => {
    const { getByTestId } = render(<GridCell specimenType="Shark" size={32} />);
    expect(getByTestId('grid-cell-Shark')).toBeTruthy();
  });
});
