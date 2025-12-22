using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("Categories")]
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } // Örn: "Kebaplar"

        [Required]
        [StringLength(50)]
        public string Slug { get; set; } // JS tarafındaki 'kebap', 'pide' ID'leri için

        [StringLength(50)]
        public string IconClass { get; set; } // Örn: "fa-pizza-slice"

        public int SortOrder { get; set; }

        // İlişkiler
        public virtual ICollection<Product> Products { get; set; }
    }
}
