using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("CuisineTypes")]
    public class CuisineType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public virtual ICollection<RestaurantCuisine> RestaurantCuisines { get; set; }
    }
}
