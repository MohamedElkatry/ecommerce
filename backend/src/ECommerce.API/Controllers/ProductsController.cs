using ECommerce.Application.Catalog;
using ECommerce.Application.Common;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll([FromQuery] int? brand, CancellationToken cancellationToken)
    {
        var products = _db.Products.AsNoTracking();

        if (brand is not null)
        {
            products = products.Where(product => product.BrandId == brand);
        }

        var result = await Project(products)
            .ToListAsync(cancellationToken);

        return Ok(new ApiResponse<List<ProductDto>>(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(int id, CancellationToken cancellationToken)
    {
        var product = await Project(_db.Products.AsNoTracking().Where(item => item.Id == id))
            .FirstOrDefaultAsync(cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(new ApiResponse<ProductDto>(product));
    }

    private static IQueryable<ProductDto> Project(IQueryable<Product> products)
    {
        return products
            .OrderBy(product => product.Title)
            .Select(product => new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                ImageCover = product.ImageCover,
                RatingsAverage = product.RatingsAverage,
                Category = new CategorySummaryDto
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                },
                Images = product.Images
                    .OrderBy(image => image.Id)
                    .Select(image => image.Url)
                    .ToList()
            });
    }
}
