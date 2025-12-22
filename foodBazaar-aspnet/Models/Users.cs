using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace foodBazaar_aspnet.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Perm { get; set; } = "User";

        //Admin , sellerRestoraunt -> sellerTakeOffRestoraunt , sellerMarketing , Courier , User  
    }
}
