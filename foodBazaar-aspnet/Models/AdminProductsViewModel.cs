using System.Collections.Generic;

namespace foodBazaar_aspnet.Models
{
    public class AdminProductsViewModel
    {
        public List<Product> Products { get; set; } = new();
        public List<Category> Categories { get; set; } = new();
    }
}