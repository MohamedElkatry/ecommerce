using ECommerce.Application.Catalog;
using ECommerce.Application.Common;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var categories = await _db.Categories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Image = category.Image
            })
            .ToListAsync(cancellationToken);

        return Ok(new ApiResponse<List<CategoryDto>>(categories));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetById(int id, CancellationToken cancellationToken)
    {
        var category = await _db.Categories
            .AsNoTracking()
            .Where(item => item.Id == id)
            .Select(item => new CategoryDto
            {
                Id = item.Id,
                Name = item.Name,
                Image = item.Image
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(new ApiResponse<CategoryDto>(category));
    }

    [HttpGet("{id:int}/subcategories")]
    public async Task<ActionResult<ApiResponse<List<SubCategoryDto>>>> GetSubCategories(int id, CancellationToken cancellationToken)
    {
        var categoryExists = await _db.Categories
            .AsNoTracking()
            .AnyAsync(category => category.Id == id, cancellationToken);

        if (!categoryExists)
        {
            return NotFound();
        }

        var subCategories = await _db.SubCategories
            .AsNoTracking()
            .Where(subCategory => subCategory.CategoryId == id)
            .OrderBy(subCategory => subCategory.Name)
            .Select(subCategory => new SubCategoryDto
            {
                Id = subCategory.Id,
                Name = subCategory.Name
            })
            .ToListAsync(cancellationToken);

        return Ok(new ApiResponse<List<SubCategoryDto>>(subCategories));
    }
}
