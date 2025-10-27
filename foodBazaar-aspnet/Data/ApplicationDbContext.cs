using foodBazaar_aspnet.Models;
using Microsoft.EntityFrameworkCore;

namespace foodBazaar_aspnet.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>()
                .Property(u => u.Perm)
                .HasDefaultValue("User");
        }

        public DbSet<Models.Users> Users { get; set; }
    }
}
