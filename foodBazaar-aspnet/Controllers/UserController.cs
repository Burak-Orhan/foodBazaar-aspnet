using Microsoft.AspNetCore.Mvc;

namespace foodBazaar_aspnet.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
