using ECommerce.Application.Catalog;

namespace ECommerce.Application.Wishlist;

public sealed class WishlistProductDto
{
    public int Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string ImageCover { get; init; } = string.Empty;

    public decimal Price { get; init; }

    public decimal RatingsAverage { get; init; }

    public CategorySummaryDto Category { get; init; } = new();
}
