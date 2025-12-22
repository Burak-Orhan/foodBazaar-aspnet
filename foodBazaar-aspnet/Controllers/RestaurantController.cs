using foodBazaar_aspnet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using foodBazaar_aspnet.Models;

namespace foodBazaar_aspnet.Controllers // Namespace eklemeyi unutma
{
    // DÜZELTME 1: İsim 'Restoraunt' değil 'Restaurant' olmalı
    public class RestaurantController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RestaurantController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Restaurant/Index
        public async Task<IActionResult> Index()
        {
            var restaurants = await _context.Restaurant.ToListAsync();

            return View(restaurants);

        }

        // GET: Restaurant/Detail/5
        public async Task<IActionResult> Detail(int id)
        {
            var restaurant = await _context.Restaurant
                .Include(r => r.Products).ThenInclude(p => p.Category)
                .Include(r => r.Products).ThenInclude(p => p.ProductTags).ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (restaurant == null) return NotFound();

            return View(restaurant);
        }

        // Bu Action JavaScript (Fetch) tarafından çağırılacak
        [HttpGet]
        public async Task<IActionResult> GetMenuData(int restaurantId)
        {
            // 1. Restoran Bilgisi
            var restaurant = await _context.Restaurant // DÜZELTME: Restaurants
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

            // 2. Kategoriler
            var categories = await _context.Category // DÜZELTME: Categories
                .OrderBy(c => c.SortOrder)
                .Select(c => new
                {
                    // DÜZELTME 3: Modelinde 'Slug' tanımladıysan burası c.Slug olmalı.
                    // Eğer modelinde 'Key' diye bir alan yoksa hata alırsın.
                    id = c.Slug,
                    name = c.Name,
                    icon = c.IconClass
                })
                .ToListAsync();

            // 3. Ürünler
            var products = await _context.Product // DÜZELTME: Products
                .Where(p => p.RestaurantId == restaurantId)
                .OrderBy(p => p.SortOrder)
                .Select(p => new
                {
                    id = "prod-" + p.Id,
                    restaurantId = "rest-" + p.RestaurantId,
                    // DÜZELTME 3: Burada da Category.Slug kullanılmalı
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