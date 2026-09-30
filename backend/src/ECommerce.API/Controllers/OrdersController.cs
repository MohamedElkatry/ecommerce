using System.Security.Claims;
using ECommerce.Application.Orders;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/orders")]
public class OrdersController : ControllerBase
{
    private const string CashPayment = "cash";

    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("checkout-session/{cartId:int}")]
    public async Task<ActionResult<CheckoutResponse>> Checkout(
        int cartId,
        [FromQuery] string? url,
        CheckoutRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var addressError = ValidateAddress(request.ShippingAddress);
        if (addressError is not null)
        {
            return BadRequest(new { message = addressError });
        }

        var cart = await _db.Carts
            .Include(item => item.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(item => item.Id == cartId && item.UserId == userId.Value, cancellationToken);

        if (cart is null)
        {
            return NotFound(new { message = "Cart not found" });
        }

        if (cart.Items.Count == 0)
        {
            return BadRequest(new { message = "Cart is empty" });
        }

        var address = request.ShippingAddress!;
        var order = new Order
        {
            UserId = userId.Value,
            CreatedAt = DateTime.UtcNow,
            IsDelivered = false,
            PaymentMethodType = CashPayment,
            ShippingCity = address.City.Trim(),
            ShippingPhone = address.Phone.Trim(),
            ShippingDetails = address.Details.Trim(),
            TotalOrderPrice = cart.Items.Sum(item => item.Product.Price * item.Count),
            Items = cart.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductTitle = item.Product.Title,
                Count = item.Count,
                Price = item.Product.Price
            }).ToList()
        };

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cart.Items);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new CheckoutResponse
        {
            Session = new CheckoutSessionResponse
            {
                Url = ResolveReturnUrl(url)
            }
        });
    }

    [HttpGet("user/{id:int}")]
    public async Task<ActionResult<List<OrderResponse>>> GetForUser(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        if (userId.Value != id)
        {
            return Forbid();
        }

        var orders = await _db.Orders
            .AsNoTracking()
            .Where(order => order.UserId == id)
            .OrderByDescending(order => order.CreatedAt)
            .Select(order => new OrderResponse
            {
                Id = order.Id,
                TotalOrderPrice = order.TotalOrderPrice,
                CreatedAt = order.CreatedAt,
                IsDelivered = order.IsDelivered,
                PaymentMethodType = order.PaymentMethodType,
                ShippingAddress = new ShippingAddressResponse
                {
                    City = order.ShippingCity,
                    Phone = order.ShippingPhone,
                    Details = order.ShippingDetails
                },
                CartItems = order.Items
                    .OrderBy(item => item.Id)
                    .Select(item => new OrderItemResponse
                    {
                        Count = item.Count,
                        Price = item.Price,
                        Product = new OrderProductResponse
                        {
                            Title = item.ProductTitle
                        }
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return Ok(orders);
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    private static string? ValidateAddress(ShippingAddressRequest? address)
    {
        if (address is null ||
            string.IsNullOrWhiteSpace(address.City) ||
            string.IsNullOrWhiteSpace(address.Phone) ||
            string.IsNullOrWhiteSpace(address.Details))
        {
            return "Shipping address is required";
        }

        return null;
    }

    private static string ResolveReturnUrl(string? url)
    {
        if (Uri.TryCreate(url, UriKind.Absolute, out var parsed) &&
            (parsed.Scheme == Uri.UriSchemeHttp || parsed.Scheme == Uri.UriSchemeHttps))
        {
            return parsed.ToString();
        }

        return "http://localhost:5173";
    }
}
