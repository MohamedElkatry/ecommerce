namespace ECommerce.Application.Catalog;

public sealed class ProductDto
{
    public int Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public decimal Price { get; init; }

    public string ImageCover { get; init; } = string.Empty;

    public decimal RatingsAverage { get; init; }

    public CategorySummaryDto Category { get; init; } = new();

    public IReadOnlyList<string> Images { get; init; } = Array.Empty<string>();
}
