using foodBazaar_aspnet.Data;
using foodBazaar_aspnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace foodBazaar_aspnet.Controllers
{
    public class AdminProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public AdminProductController(ApplicationDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        public async Task<IActionResult> Index()
        {
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Restaurant)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            // Dropdown (Seçim Kutusu) için Kategorileri ve Restoranları hazırlıyoruz
            ViewBag.Categories = new SelectList(_context.Category, "Id", "Name");
            ViewBag.Restaurants = new SelectList(_context.Restaurant, "Id", "Name");
            
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile ImageFile, string NewCategoryName)
        {
            ModelState.Remove("Category");
            ModelState.Remove("Restaurant");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("ProductTags");

            if (!string.IsNullOrEmpty(NewCategoryName))
            {
                ModelState.Remove("CategoryId");
            }

            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(NewCategoryName))
                {
                    var newCategory = new Category
                    {
                        Name = NewCategoryName,
                        Slug = NewCategoryName.ToLower().Replace(" ", "-").Replace("ı", "i").Replace("ğ", "g").Replace("ü", "u").Replace("ş", "s").Replace("ö", "o").Replace("ç", "c"),
                        IconClass = "fa-utensils",
                        SortOrder = 99
                    };

                    _context.Category.Add(newCategory);
                    await _context.SaveChangesAsync();

                    product.CategoryId = newCategory.Id;
                }

                if (ImageFile != null)
                {
                    string wwwRootPath = _hostEnvironment.WebRootPath;
                    string pathDir = Path.Combine(wwwRootPath, "image", "product");
                    if (!Directory.Exists(pathDir)) Directory.CreateDirectory(pathDir);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    string filePath = Path.Combine(pathDir, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(fileStream);
                    }

                    product.ImageUrl = "image/product/" + fileName;
                }
                else
                {
                    product.ImageUrl = "image/pattern.svg";
                }

                _context.Add(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.Categories = new SelectList(_context.Category, "Id", "Name");
            ViewBag.Restaurants = new SelectList(_context.Restaurant, "Id", "Name");

            return View(product);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Product.FindAsync(id);
            if (product != null)
            {
                _context.Product.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}