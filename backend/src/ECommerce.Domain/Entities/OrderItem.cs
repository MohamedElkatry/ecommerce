namespace ECommerce.Domain.Entities;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order Order { get; set; } = null!;

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public string ProductTitle { get; set; } = string.Empty;

    public int Count { get; set; }

    public decimal Price { get; set; }
}
