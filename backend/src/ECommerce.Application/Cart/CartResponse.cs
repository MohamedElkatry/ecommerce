namespace ECommerce.Application.Cart;

public sealed class CartResponse
{
    public int? CartId { get; init; }

    public int NumOfCartItems { get; init; }

    public CartDataResponse Data { get; init; } = new();
}

public sealed class CartDataResponse
{
    public IReadOnlyList<CartItemResponse> Products { get; init; } = Array.Empty<CartItemResponse>();

    public decimal TotalCartPrice { get; init; }
}

public sealed class CartItemResponse
{
    public int Count { get; init; }

    public decimal Price { get; init; }

    public CartProductResponse Product { get; init; } = new();
}

public sealed class CartProductResponse
{
    public int Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string ImageCover { get; init; } = string.Empty;
}
