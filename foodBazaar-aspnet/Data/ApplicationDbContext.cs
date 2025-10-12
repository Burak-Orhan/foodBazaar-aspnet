using Microsoft.EntityFrameworkCore;

namespace foodBazaar_aspnet.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Models.Users> Users { get; set; }
    }
}
