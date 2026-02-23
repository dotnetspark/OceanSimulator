using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface ISpecimenFactory
{
    ISpecimen Create(SpecimenType type, Position position);
}
