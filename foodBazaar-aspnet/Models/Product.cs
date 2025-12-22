using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        public bool InStock { get; set; } = true;

        public int SortOrder { get; set; }

        // Foreign Keys
        [ForeignKey("Restaurant")]
        public int RestaurantId { get; set; }
        public virtual Restaurant Restaurant { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        // Çoka-çok ilişki (Etiketler için)
        public virtual ICollection<ProductTag> ProductTags { get; set; }
    }
}
