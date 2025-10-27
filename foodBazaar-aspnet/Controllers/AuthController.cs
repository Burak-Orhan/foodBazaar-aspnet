using foodBazaar_aspnet.Data;
using foodBazaar_aspnet.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace foodBazaar_aspnet.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(Users model)
        {
            if (ModelState.IsValid)
            {
                var exists = _context.Users.FirstOrDefault(u => u.Email == model.Email);
                if (exists != null)
                {
                    ViewBag.Error = "Bu e-posta zaten kayıtlı.";
                    return View();
                }

                if (string.IsNullOrEmpty(model.Perm))
                    model.Perm = "User";

                _context.Users.Add(model);
                await _context.SaveChangesAsync();

                await SignInUser(model);
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email && u.Password == password);

            if (user != null)
            {
                await SignInUser(user);

                TempData["RedirectAfterLogin"] = true;

                return RedirectToAction("Index", "User");
            }

            ViewBag.Error = "Geçersiz e-posta veya şifre!";
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        private async Task SignInUser(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Perm)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTime.UtcNow.AddHours(2)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);
        }
    }
}
