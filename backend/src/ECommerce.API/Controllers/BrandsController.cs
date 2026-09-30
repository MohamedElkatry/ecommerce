using ECommerce.Application.Catalog;
using ECommerce.Application.Common;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/brands")]
public class BrandsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BrandsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<BrandDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var brands = await _db.Brands
            .AsNoTracking()
            .OrderBy(brand => brand.Name)
            .Select(brand => new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Image = brand.Image
            })
            .ToListAsync(cancellationToken);

        return Ok(new ApiResponse<List<BrandDto>>(brands));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<BrandDto>>> GetById(int id, CancellationToken cancellationToken)
    {
        var brand = await _db.Brands
            .AsNoTracking()
            .Where(item => item.Id == id)
            .Select(item => new BrandDto
            {
                Id = item.Id,
                Name = item.Name,
                Image = item.Image
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (brand is null)
        {
            return NotFound();
        }

        return Ok(new ApiResponse<BrandDto>(brand));
    }
}
