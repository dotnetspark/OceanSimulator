using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public abstract class EnergeticSpecimen : LivingSpecimen
{
    private int _energyThreshold;
    
    public int EnergyCounter { get; set; }
    public int EnergyThreshold 
    { 
        get => _energyThreshold;
        set
        {
            _energyThreshold = value;
            if (EnergyCounter == 0)
                EnergyCounter = value;
        }
    }
    
    protected EnergeticSpecimen(Position position) : base(position)
    {
    }
}
