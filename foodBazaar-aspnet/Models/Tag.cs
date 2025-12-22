using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("Tags")]
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } // Görünecek İsim: "Spicy"

        [StringLength(50)]
        public string Type { get; set; } // Kod tarafı için: "spicy"

        [StringLength(20)]
        public string BackgroundColor { get; set; } // "#FF3B30"

        [StringLength(20)]
        public string TextColor { get; set; } = "white";

        public virtual ICollection<ProductTag> ProductTags { get; set; }
    }
}
