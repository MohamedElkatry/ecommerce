namespace ECommerce.Application.Orders;

public sealed class CheckoutResponse
{
    public CheckoutSessionResponse Session { get; init; } = new();
}

public sealed class CheckoutSessionResponse
{
    public string Url { get; init; } = string.Empty;
}
