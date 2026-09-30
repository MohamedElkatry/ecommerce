using System.Text.Json.Serialization;

namespace ECommerce.Application.Catalog;

public sealed class BrandDto
{
    public int Id { get; init; }

    [JsonPropertyName("_id")]
    public int LegacyId => Id;

    public string Name { get; init; } = string.Empty;

    public string Image { get; init; } = string.Empty;
}
