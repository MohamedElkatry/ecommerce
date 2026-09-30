using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<SubCategory> SubCategories => Set<SubCategory>();

    public DbSet<Brand> Brands => Set<Brand>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Cart> Carts => Set<Cart>();

    public DbSet<CartItem> CartItems => Set<CartItem>();

    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(category => category.Name).HasMaxLength(100).IsRequired();
            entity.Property(category => category.Image).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<SubCategory>(entity =>
        {
            entity.Property(subCategory => subCategory.Name).HasMaxLength(100).IsRequired();
            entity.HasOne(subCategory => subCategory.Category)
                .WithMany(category => category.SubCategories)
                .HasForeignKey(subCategory => subCategory.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.Property(brand => brand.Name).HasMaxLength(100).IsRequired();
            entity.Property(brand => brand.Image).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(product => product.Title).HasMaxLength(200).IsRequired();
            entity.Property(product => product.Description).HasMaxLength(2000).IsRequired();
            entity.Property(product => product.ImageCover).HasMaxLength(500).IsRequired();
            entity.Property(product => product.Price).HasPrecision(18, 2);
            entity.Property(product => product.RatingsAverage).HasPrecision(3, 1);
            entity.HasOne(product => product.Category)
                .WithMany(category => category.Products)
                .HasForeignKey(product => product.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(product => product.Brand)
                .WithMany(brand => brand.Products)
                .HasForeignKey(product => product.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.Property(image => image.Url).HasMaxLength(500).IsRequired();
            entity.HasOne(image => image.Product)
                .WithMany(product => product.Images)
                .HasForeignKey(image => image.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(user => user.Name).HasMaxLength(15).IsRequired();
            entity.Property(user => user.Email).HasMaxLength(256).IsRequired();
            entity.Property(user => user.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(user => user.Phone).HasMaxLength(11).IsRequired();
            entity.HasIndex(user => user.Email).IsUnique();
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasIndex(cart => cart.UserId).IsUnique();
            entity.HasOne(cart => cart.User)
                .WithMany()
                .HasForeignKey(cart => cart.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(cart => cart.Items)
                .WithOne(item => item.Cart)
                .HasForeignKey(item => item.CartId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(item => new { item.CartId, item.ProductId }).IsUnique();
            entity.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.HasIndex(item => new { item.UserId, item.ProductId }).IsUnique();
            entity.HasOne(item => item.User)
                .WithMany()
                .HasForeignKey(item => item.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(order => order.TotalOrderPrice).HasPrecision(18, 2);
            entity.Property(order => order.PaymentMethodType).HasMaxLength(30).IsRequired();
            entity.Property(order => order.ShippingCity).HasMaxLength(100).IsRequired();
            entity.Property(order => order.ShippingPhone).HasMaxLength(20).IsRequired();
            entity.Property(order => order.ShippingDetails).HasMaxLength(500).IsRequired();
            entity.HasOne(order => order.User)
                .WithMany()
                .HasForeignKey(order => order.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(order => order.Items)
                .WithOne(item => item.Order)
                .HasForeignKey(item => item.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(item => item.ProductTitle).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Price).HasPrecision(18, 2);
            entity.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electronics", Image = "https://picsum.photos/seed/electronics/400/400" },
            new Category { Id = 2, Name = "Fashion", Image = "https://picsum.photos/seed/fashion/400/400" },
            new Category { Id = 3, Name = "Groceries", Image = "https://picsum.photos/seed/groceries/400/400" },
            new Category { Id = 4, Name = "Home", Image = "https://picsum.photos/seed/home/400/400" },
            new Category { Id = 5, Name = "Beauty", Image = "https://picsum.photos/seed/beauty/400/400" });

        modelBuilder.Entity<SubCategory>().HasData(
            new SubCategory { Id = 1, Name = "Phones", CategoryId = 1 },
            new SubCategory { Id = 2, Name = "Laptops", CategoryId = 1 },
            new SubCategory { Id = 3, Name = "Men", CategoryId = 2 },
            new SubCategory { Id = 4, Name = "Women", CategoryId = 2 },
            new SubCategory { Id = 5, Name = "Fruit", CategoryId = 3 },
            new SubCategory { Id = 6, Name = "Dairy", CategoryId = 3 },
            new SubCategory { Id = 7, Name = "Kitchen", CategoryId = 4 },
            new SubCategory { Id = 8, Name = "Skincare", CategoryId = 5 });

        modelBuilder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "Samsung", Image = "https://picsum.photos/seed/samsung/400/400" },
            new Brand { Id = 2, Name = "Zara", Image = "https://picsum.photos/seed/zara/400/400" },
            new Brand { Id = 3, Name = "Apple", Image = "https://picsum.photos/seed/apple/400/400" },
            new Brand { Id = 4, Name = "Nike", Image = "https://picsum.photos/seed/nike/400/400" },
            new Brand { Id = 5, Name = "Nestle", Image = "https://picsum.photos/seed/nestle/400/400" },
            new Brand { Id = 6, Name = "Ikea", Image = "https://picsum.photos/seed/ikea/400/400" });

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Title = "Samsung Galaxy Phone",
                Description = "A smartphone with a clear display and a full day of battery.",
                Price = 15000m,
                ImageCover = "https://picsum.photos/seed/phone/600/600",
                RatingsAverage = 4.5m,
                CategoryId = 1,
                BrandId = 1
            },
            new Product
            {
                Id = 2,
                Title = "Samsung Laptop",
                Description = "A lightweight laptop for study and everyday work.",
                Price = 28000m,
                ImageCover = "https://picsum.photos/seed/laptop/600/600",
                RatingsAverage = 4.2m,
                CategoryId = 1,
                BrandId = 1
            },
            new Product
            {
                Id = 3,
                Title = "Zara Cotton Shirt",
                Description = "A plain cotton shirt for daily wear.",
                Price = 900m,
                ImageCover = "https://picsum.photos/seed/shirt/600/600",
                RatingsAverage = 4.0m,
                CategoryId = 2,
                BrandId = 2
            },
            new Product
            {
                Id = 4,
                Title = "Apple iPhone",
                Description = "A phone with a bright screen and a strong camera.",
                Price = 42000m,
                ImageCover = "https://picsum.photos/seed/iphone/600/600",
                RatingsAverage = 4.8m,
                CategoryId = 1,
                BrandId = 3
            },
            new Product
            {
                Id = 5,
                Title = "Apple Laptop",
                Description = "A thin laptop for study and design work.",
                Price = 55000m,
                ImageCover = "https://picsum.photos/seed/macbook/600/600",
                RatingsAverage = 4.7m,
                CategoryId = 1,
                BrandId = 3
            },
            new Product
            {
                Id = 6,
                Title = "Nike Running Shoes",
                Description = "Light shoes for daily walks and running.",
                Price = 3200m,
                ImageCover = "https://picsum.photos/seed/shoes/600/600",
                RatingsAverage = 4.6m,
                CategoryId = 2,
                BrandId = 4
            },
            new Product
            {
                Id = 7,
                Title = "Zara Summer Dress",
                Description = "A light dress for warm days.",
                Price = 1400m,
                ImageCover = "https://picsum.photos/seed/dress/600/600",
                RatingsAverage = 4.3m,
                CategoryId = 2,
                BrandId = 2
            },
            new Product
            {
                Id = 8,
                Title = "Nestle Milk Box",
                Description = "A one-liter box of milk.",
                Price = 35m,
                ImageCover = "https://picsum.photos/seed/milk/600/600",
                RatingsAverage = 4.4m,
                CategoryId = 3,
                BrandId = 5
            },
            new Product
            {
                Id = 9,
                Title = "Fresh Red Apples",
                Description = "One kilogram of red apples.",
                Price = 45m,
                ImageCover = "https://picsum.photos/seed/apples/600/600",
                RatingsAverage = 4.1m,
                CategoryId = 3,
                BrandId = 5
            },
            new Product
            {
                Id = 10,
                Title = "Ikea Kitchen Pan",
                Description = "A non-stick pan for everyday cooking.",
                Price = 650m,
                ImageCover = "https://picsum.photos/seed/pan/600/600",
                RatingsAverage = 4.2m,
                CategoryId = 4,
                BrandId = 6
            },
            new Product
            {
                Id = 11,
                Title = "Ikea Desk Lamp",
                Description = "A small lamp for a study desk.",
                Price = 480m,
                ImageCover = "https://picsum.photos/seed/lamp/600/600",
                RatingsAverage = 4.0m,
                CategoryId = 4,
                BrandId = 6
            },
            new Product
            {
                Id = 12,
                Title = "Daily Face Cream",
                Description = "A light cream for everyday skincare.",
                Price = 220m,
                ImageCover = "https://picsum.photos/seed/cream/600/600",
                RatingsAverage = 4.5m,
                CategoryId = 5,
                BrandId = 2
            });

        modelBuilder.Entity<ProductImage>().HasData(
            new ProductImage { Id = 1, ProductId = 1, Url = "https://picsum.photos/seed/phone/600/600" },
            new ProductImage { Id = 2, ProductId = 1, Url = "https://picsum.photos/seed/phone-back/600/600" },
            new ProductImage { Id = 3, ProductId = 2, Url = "https://picsum.photos/seed/laptop/600/600" },
            new ProductImage { Id = 4, ProductId = 3, Url = "https://picsum.photos/seed/shirt/600/600" },
            new ProductImage { Id = 5, ProductId = 4, Url = "https://picsum.photos/seed/iphone/600/600" },
            new ProductImage { Id = 6, ProductId = 5, Url = "https://picsum.photos/seed/macbook/600/600" },
            new ProductImage { Id = 7, ProductId = 6, Url = "https://picsum.photos/seed/shoes/600/600" },
            new ProductImage { Id = 8, ProductId = 7, Url = "https://picsum.photos/seed/dress/600/600" },
            new ProductImage { Id = 9, ProductId = 8, Url = "https://picsum.photos/seed/milk/600/600" },
            new ProductImage { Id = 10, ProductId = 9, Url = "https://picsum.photos/seed/apples/600/600" },
            new ProductImage { Id = 11, ProductId = 10, Url = "https://picsum.photos/seed/pan/600/600" },
            new ProductImage { Id = 12, ProductId = 11, Url = "https://picsum.photos/seed/lamp/600/600" },
            new ProductImage { Id = 13, ProductId = 12, Url = "https://picsum.photos/seed/cream/600/600" });
    }
}
