using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("RestaurantCuisines")]
    public class RestaurantCuisine
    {
        [ForeignKey("Restaurant")]
        public int RestaurantId { get; set; }
        public virtual Restaurant Restaurant { get; set; }

        [ForeignKey("CuisineType")]
        public int CuisineTypeId { get; set; }
        public virtual CuisineType CuisineType { get; set; }
    }
}
