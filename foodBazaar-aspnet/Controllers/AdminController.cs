using foodBazaar_aspnet.Data;
using foodBazaar_aspnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace foodBazaar_aspnet.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public AdminController(ApplicationDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Products()
        {
            var categories = await _context.Category
                .OrderBy(c => c.SortOrder)
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    icon = c.IconClass ?? "📦"
                })
                .ToListAsync();

            var products = await _context.Product
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    description = p.Description,
                    price = p.Price,
                    currency = "TRY",
                    image = (p.ImageUrl ?? "").Replace("\\", "/"),

                    categoryId = p.CategoryId,
                    active = p.InStock
                })
                .ToListAsync();

            var restaurants = await _context.Restaurant
                .OrderBy(r => r.Name)
                .Select(r => new { id = r.Id, name = r.Name })
                .ToListAsync();

            var data = new
            {
                Products = products,
                Categories = categories,
                Restaurants = restaurants
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            ViewBag.InitialData = JsonSerializer.Serialize(data, options);

            return View();
        }

        public IActionResult CreateProduct()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateProduct(Product model, IFormFile? file)
        {
            if (ModelState.IsValid)
            {
                if (file != null)
                {
                    string wwwRootPath = _hostEnvironment.WebRootPath;
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string productPath = Path.Combine(wwwRootPath, @"images\products");

                    if (!Directory.Exists(productPath)) Directory.CreateDirectory(productPath);

                    using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    model.ImageUrl = @"\images\products\" + fileName;
                }

                _context.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Products));
            }
            return View(model);
        }

        public IActionResult Profile()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductAjax([FromForm] Product model, IFormFile? file, [FromForm] string? NewCategoryName)
        {
            try
            {
                if (file != null)
                {
                    string wwwRootPath = _hostEnvironment.WebRootPath;
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string productPath = Path.Combine(wwwRootPath, "images", "products");

                    if (!Directory.Exists(productPath)) Directory.CreateDirectory(productPath);

                    using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    model.ImageUrl = "/images/products/" + fileName;
                }
                else
                {
                    model.ImageUrl = "";
                }

                if (!string.IsNullOrEmpty(NewCategoryName))
                {
                    string slug = NewCategoryName.ToLower()
                        .Replace(" ", "-").Replace("ı", "i").Replace("ğ", "g")
                        .Replace("ü", "u").Replace("ş", "s").Replace("ö", "o")
                        .Replace("ç", "c");

                    var newCategory = new Category
                    {
                        Name = NewCategoryName,
                        Slug = slug,
                        IconClass = "fa-utensils",
                        SortOrder = 99
                    };

                    _context.Category.Add(newCategory);
                    await _context.SaveChangesAsync();

                    model.CategoryId = newCategory.Id;
                }

                model.Id = 0;
                model.InStock = true;

                _context.Add(model);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "İşlem başarılı",
                    product = new
                    {
                        id = model.Id,
                        name = model.Name,
                        description = model.Description,
                        price = model.Price,
                        currency = "TRY",
                        image = model.ImageUrl,
                        categoryId = model.CategoryId,
                        restaurantId = model.RestaurantId,
                        active = model.InStock
                    }
                });
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return Json(new { success = false, message = "Hata: " + msg });
            }
        }
    }
}