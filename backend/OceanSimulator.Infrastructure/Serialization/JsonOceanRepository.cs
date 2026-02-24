using System.Text.Json;
using System.Text.Json.Serialization;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Infrastructure.Serialization;

public class JsonOceanRepository : IOceanRepository
{
    private readonly JsonSerializerOptions _options;
    
    public JsonOceanRepository()
    {
        _options = new JsonSerializerOptions
        {
            WriteIndented = true,
            Converters = { new SpecimenJsonConverter() }
        };
    }
    
    public async Task SaveAsync(IOcean ocean, string filePath)
    {
        await using var fs = File.Create(filePath);
        await SaveAsync(ocean, fs);
    }

    public async Task SaveAsync(IOcean ocean, Stream stream)
    {
        var dto = new OceanDto
        {
            Rows = ocean.Rows,
            Cols = ocean.Cols,
            Specimens = ocean.GetAllSpecimens().Select(SerializeSpecimen).ToList()
        };
        await JsonSerializer.SerializeAsync(stream, dto, _options);
    }

    public async Task<IOcean> LoadAsync(string filePath)
    {
        await using var fs = File.OpenRead(filePath);
        return await LoadAsync(fs);
    }

    public async Task<IOcean> LoadAsync(Stream stream)
    {
        var dto = await JsonSerializer.DeserializeAsync<OceanDto>(stream, _options);

        if (dto == null)
            throw new InvalidOperationException("Failed to deserialize ocean");

        var ocean = new Ocean(dto.Rows, dto.Cols);
        foreach (var specimenDto in dto.Specimens)
        {
            var specimen = DeserializeSpecimen(specimenDto);
            ocean.AddSpecimen(specimen);
        }

        return ocean;
    }
    
    private SpecimenDto SerializeSpecimen(ISpecimen specimen)
    {
        var dto = new SpecimenDto
        {
            Id = specimen.Id,
            Type = specimen.Type,
            Position = specimen.Position,
            HasMovedThisSnapshot = specimen.HasMovedThisSnapshot
        };
        
        if (specimen is LivingSpecimen living)
        {
            dto.BreedingCounter = living.BreedingCounter;
            dto.BreedingThreshold = living.BreedingThreshold;
        }
        
        if (specimen is EnergeticSpecimen energetic)
        {
            dto.EnergyCounter = energetic.EnergyCounter;
            dto.EnergyThreshold = energetic.EnergyThreshold;
        }
        
        if (specimen is Shark shark)
        {
            dto.Weight = shark.Weight;
        }
        
        return dto;
    }
    
    private ISpecimen DeserializeSpecimen(SpecimenDto dto)
    {
        ISpecimen specimen = dto.Type switch
        {
            SpecimenType.Plankton => new Plankton(dto.Position),
            SpecimenType.Sardine => new Sardine(dto.Position),
            SpecimenType.Shark => new Shark(dto.Position),
            SpecimenType.Crab => new Crab(dto.Position),
            SpecimenType.Reef => new Reef(dto.Position),
            SpecimenType.DeadSardine => new DeadSardine(dto.Position),
            SpecimenType.DeadShark => new DeadShark(dto.Position),
            _ => throw new ArgumentException($"Unknown specimen type: {dto.Type}")
        };
        
        specimen.HasMovedThisSnapshot = dto.HasMovedThisSnapshot;
        
        if (specimen is LivingSpecimen living && dto.BreedingCounter.HasValue && dto.BreedingThreshold.HasValue)
        {
            living.BreedingCounter = dto.BreedingCounter.Value;
            living.BreedingThreshold = dto.BreedingThreshold.Value;
        }
        
        if (specimen is EnergeticSpecimen energetic && dto.EnergyCounter.HasValue && dto.EnergyThreshold.HasValue)
        {
            energetic.EnergyCounter = dto.EnergyCounter.Value;
            energetic.EnergyThreshold = dto.EnergyThreshold.Value;
        }
        
        if (specimen is Shark shark && dto.Weight.HasValue)
        {
            shark.Weight = dto.Weight.Value;
        }
        
        return specimen;
    }
    
    private class OceanDto
    {
        public int Rows { get; set; }
        public int Cols { get; set; }
        public List<SpecimenDto> Specimens { get; set; } = new();
    }
    
    private class SpecimenDto
    {
        public Guid Id { get; set; }
        public SpecimenType Type { get; set; }
        public Position Position { get; set; } = null!;
        public bool HasMovedThisSnapshot { get; set; }
        public int? BreedingCounter { get; set; }
        public int? BreedingThreshold { get; set; }
        public int? EnergyCounter { get; set; }
        public int? EnergyThreshold { get; set; }
        public int? Weight { get; set; }
    }
    
    private class SpecimenJsonConverter : JsonConverter<ISpecimen>
    {
        public override ISpecimen? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            throw new NotImplementedException("Use SpecimenDto for deserialization");
        }
        
        public override void Write(Utf8JsonWriter writer, ISpecimen value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, value.GetType(), options);
        }
    }
}
