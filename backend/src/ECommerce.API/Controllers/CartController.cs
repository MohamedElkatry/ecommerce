using System.Security.Claims;
using ECommerce.Application.Cart;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/cart")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> Get(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        return Ok(await BuildCartAsync(userId.Value, cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<CartResponse>> Add(AddToCartRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var productExists = await _db.Products
            .AnyAsync(product => product.Id == request.ProductId, cancellationToken);

        if (!productExists)
        {
            return NotFound(new { message = "Product not found" });
        }

        var cart = await _db.Carts
            .Include(item => item.Items)
            .FirstOrDefaultAsync(item => item.UserId == userId.Value, cancellationToken);

        if (cart is null)
        {
            cart = new Cart { UserId = userId.Value };
            _db.Carts.Add(cart);
        }

        var existing = cart.Items.FirstOrDefault(item => item.ProductId == request.ProductId);
        if (existing is null)
        {
            cart.Items.Add(new CartItem
            {
                ProductId = request.ProductId,
                Count = 1
            });
        }
        else
        {
            existing.Count += 1;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(await BuildCartAsync(userId.Value, cancellationToken));
    }

    [HttpPut("{productId:int}")]
    public async Task<ActionResult<CartResponse>> UpdateCount(int productId, UpdateCartItemRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        if (request.Count < 1)
        {
            return BadRequest(new { message = "Count must be at least 1" });
        }

        var item = await _db.CartItems
            .FirstOrDefaultAsync(cartItem => cartItem.Cart.UserId == userId.Value && cartItem.ProductId == productId, cancellationToken);

        if (item is null)
        {
            return NotFound(new { message = "Product is not in the cart" });
        }

        item.Count = request.Count;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(await BuildCartAsync(userId.Value, cancellationToken));
    }

    [HttpDelete("{productId:int}")]
    public async Task<ActionResult<CartResponse>> Remove(int productId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var item = await _db.CartItems
            .FirstOrDefaultAsync(cartItem => cartItem.Cart.UserId == userId.Value && cartItem.ProductId == productId, cancellationToken);

        if (item is null)
        {
            return NotFound(new { message = "Product is not in the cart" });
        }

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(await BuildCartAsync(userId.Value, cancellationToken));
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    private async Task<CartResponse> BuildCartAsync(int userId, CancellationToken cancellationToken)
    {
        var cartId = await _db.Carts
            .AsNoTracking()
            .Where(cart => cart.UserId == userId)
            .Select(cart => (int?)cart.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (cartId is null)
        {
            return EmptyCart();
        }

        var products = await _db.CartItems
            .AsNoTracking()
            .Where(item => item.CartId == cartId)
            .OrderBy(item => item.Id)
            .Select(item => new CartItemResponse
            {
                Count = item.Count,
                Price = item.Product.Price,
                Product = new CartProductResponse
                {
                    Id = item.Product.Id,
                    Title = item.Product.Title,
                    ImageCover = item.Product.ImageCover
                }
            })
            .ToListAsync(cancellationToken);

        return new CartResponse
        {
            CartId = cartId,
            NumOfCartItems = products.Count,
            Data = new CartDataResponse
            {
                Products = products,
                TotalCartPrice = products.Sum(item => item.Price * item.Count)
            }
        };
    }

    private static CartResponse EmptyCart()
    {
        return new CartResponse
        {
            CartId = null,
            NumOfCartItems = 0,
            Data = new CartDataResponse
            {
                Products = Array.Empty<CartItemResponse>(),
                TotalCartPrice = 0
            }
        };
    }
}
