using foodBazaar_aspnet.Models;
using Microsoft.EntityFrameworkCore;

namespace foodBazaar_aspnet.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Models.Category> Category { get; set; }
        public DbSet<Models.CuisineType> CuisineType { get; set; }
        public DbSet<Models.Product> Product { get; set; }
        public DbSet<Models.ProductTag> ProductTag { get; set; }
        public DbSet<Models.RestaurantCuisine> RestaurantCuisine { get; set; }
        public DbSet<Models.Restaurant> Restaurant { get; set; }
        public DbSet<Models.Tag> Tag { get; set; }
        public DbSet<Models.Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductTag>()
                .HasKey(pt => new { pt.ProductId, pt.TagId });

            modelBuilder.Entity<RestaurantCuisine>()
                .HasKey(rc => new { rc.RestaurantId, rc.CuisineTypeId });

            modelBuilder.Entity<Users>()
                .Property(u => u.Perm)
                .HasDefaultValue("User");

            base.OnModelCreating(modelBuilder);
        }
    }
}
