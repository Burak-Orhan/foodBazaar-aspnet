using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    [Table("ProductTags")]
    public class ProductTag
    {
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }

        [ForeignKey("Tag")]
        public int TagId { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
