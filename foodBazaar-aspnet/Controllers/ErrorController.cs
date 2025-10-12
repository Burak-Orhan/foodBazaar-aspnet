using Microsoft.AspNetCore.Mvc;

namespace foodBazaar_aspnet.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult Error(int statusCode)
        {
            if (statusCode == 404)
            {
                return View("404");
            }
            else if (statusCode == 500)
            {
                return View("500");
            }
            else
            {
                return View("Error");
            }
        }
    }
}
