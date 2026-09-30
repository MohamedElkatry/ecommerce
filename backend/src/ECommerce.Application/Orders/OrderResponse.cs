namespace ECommerce.Application.Orders;

public sealed class OrderResponse
{
    public int Id { get; init; }

    public decimal TotalOrderPrice { get; init; }

    public DateTime CreatedAt { get; init; }

    public bool IsDelivered { get; init; }

    public string PaymentMethodType { get; init; } = string.Empty;

    public ShippingAddressResponse ShippingAddress { get; init; } = new();

    public IReadOnlyList<OrderItemResponse> CartItems { get; init; } = Array.Empty<OrderItemResponse>();
}

public sealed class ShippingAddressResponse
{
    public string City { get; init; } = string.Empty;

    public string Phone { get; init; } = string.Empty;

    public string Details { get; init; } = string.Empty;
}

public sealed class OrderItemResponse
{
    public int Count { get; init; }

    public decimal Price { get; init; }

    public OrderProductResponse Product { get; init; } = new();
}

public sealed class OrderProductResponse
{
    public string Title { get; init; } = string.Empty;
}
