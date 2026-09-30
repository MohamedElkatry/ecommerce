using System.Security.Claims;
using ECommerce.Application.Catalog;
using ECommerce.Application.Common;
using ECommerce.Application.Wishlist;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/wishlist")]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _db;

    public WishlistController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WishlistProductDto>>>> Get(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        return Ok(new ApiResponse<List<WishlistProductDto>>(await ListAsync(userId.Value, cancellationToken)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<List<WishlistProductDto>>>> Add(AddToWishlistRequest request, CancellationToken cancellationToken)
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

        var alreadySaved = await _db.WishlistItems
            .AnyAsync(item => item.UserId == userId.Value && item.ProductId == request.ProductId, cancellationToken);

        if (!alreadySaved)
        {
            _db.WishlistItems.Add(new WishlistItem
            {
                UserId = userId.Value,
                ProductId = request.ProductId
            });
            await _db.SaveChangesAsync(cancellationToken);
        }

        return Ok(new ApiResponse<List<WishlistProductDto>>(await ListAsync(userId.Value, cancellationToken)));
    }

    [HttpDelete("{productId:int}")]
    public async Task<ActionResult<ApiResponse<List<WishlistProductDto>>>> Remove(int productId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var item = await _db.WishlistItems
            .FirstOrDefaultAsync(wishlistItem => wishlistItem.UserId == userId.Value && wishlistItem.ProductId == productId, cancellationToken);

        if (item is null)
        {
            return NotFound(new { message = "Product is not in the wishlist" });
        }

        _db.WishlistItems.Remove(item);
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new ApiResponse<List<WishlistProductDto>>(await ListAsync(userId.Value, cancellationToken)));
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    private Task<List<WishlistProductDto>> ListAsync(int userId, CancellationToken cancellationToken)
    {
        return _db.WishlistItems
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .OrderBy(item => item.Id)
            .Select(item => new WishlistProductDto
            {
                Id = item.Product.Id,
                Title = item.Product.Title,
                ImageCover = item.Product.ImageCover,
                Price = item.Product.Price,
                RatingsAverage = item.Product.RatingsAverage,
                Category = new CategorySummaryDto
                {
                    Id = item.Product.Category.Id,
                    Name = item.Product.Category.Name
                }
            })
            .ToListAsync(cancellationToken);
    }
}
