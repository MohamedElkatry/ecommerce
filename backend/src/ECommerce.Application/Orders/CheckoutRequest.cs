namespace ECommerce.Application.Orders;

public sealed class CheckoutRequest
{
    public ShippingAddressRequest? ShippingAddress { get; set; }
}

public sealed class ShippingAddressRequest
{
    public string City { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Details { get; set; } = string.Empty;
}
