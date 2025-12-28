using foodBazaar_aspnet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using foodBazaar_aspnet.Models;

namespace foodBazaar_aspnet.Controllers
{
    public class RestaurantController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RestaurantController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var restaurants = await _context.Restaurant.ToListAsync();

            return View(restaurants);

        }

        public async Task<IActionResult> Detail(int id)
        {
            var restaurant = await _context.Restaurant
                .Include(r => r.Products).ThenInclude(p => p.Category)
                .Include(r => r.Products).ThenInclude(p => p.ProductTags).ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (restaurant == null) return NotFound();

            return View(restaurant);
        }

        [HttpGet]
        public async Task<IActionResult> GetMenuData(int restaurantId)
        {
            // 1. Restoran Bilgisi
            var restaurant = await _context.Restaurant
                .Include(r => r.RestaurantCuisines).ThenInclude(rc => rc.CuisineType)
                .Where(r => r.Id == restaurantId)
                .Select(r => new
                {
                    id = "rest-" + r.Id,
                    name = r.Name,
                    rating = r.Rating,
                    reviewCount = r.ReviewCount,
                    deliveryTime = r.DeliveryTime,
                    minimumOrder = r.MinimumOrder,
                    status = r.Status,
                    coverImage = r.CoverImageUrl,
                    description = r.Description,
                    cuisineTypes = r.RestaurantCuisines.Select(rc => rc.CuisineType.Name).ToList()
                })
                .FirstOrDefaultAsync();

            if (restaurant == null) return NotFound();

            var categories = await _context.Category
                .OrderBy(c => c.SortOrder)
                .Select(c => new
                {
                    id = c.Slug,
                    name = c.Name,
                    icon = c.IconClass
                })
                .ToListAsync();

            var products = await _context.Product
                .Where(p => p.RestaurantId == restaurantId)
                .OrderBy(p => p.SortOrder)
                .Select(p => new
                {
                    id = "prod-" + p.Id,
                    restaurantId = "rest-" + p.RestaurantId,
                    categoryId = p.Category.Slug,
                    name = p.Name,
                    description = p.Description,
                    price = p.Price,
                    image = p.ImageUrl,
                    inStock = p.InStock,
                    sortOrder = p.SortOrder,
                    tags = p.ProductTags.Select(pt => new
                    {
                        name = pt.Tag.Name,
                        type = pt.Tag.Type,
                        color = pt.Tag.BackgroundColor,
                        textColor = pt.Tag.TextColor
                    }).ToList()
                })
                .ToListAsync();

            return Json(new { restaurant, categories, products });
        }
    }
}