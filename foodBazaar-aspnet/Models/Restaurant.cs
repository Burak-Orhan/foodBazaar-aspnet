using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("Restaurants")]
    public class Restaurant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Column(TypeName = "decimal(3,1)")] // SQL'de 4.7 gibi tutmak için
        public decimal Rating { get; set; }

        public int ReviewCount { get; set; }

        [StringLength(50)]
        public string DeliveryTime { get; set; } // Örn: "25-35 dk"

        [Column(TypeName = "decimal(18,2)")] // Para birimi hassasiyeti
        public decimal MinimumOrder { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "open";

        [StringLength(255)]
        public string CoverImageUrl { get; set; }

        // İlişkiler
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<RestaurantCuisine> RestaurantCuisines { get; set; }
    }
}
