using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerce.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ExpandCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "Id", "Image", "Name" },
                values: new object[,]
                {
                    { 3, "https://picsum.photos/seed/apple/400/400", "Apple" },
                    { 4, "https://picsum.photos/seed/nike/400/400", "Nike" },
                    { 5, "https://picsum.photos/seed/nestle/400/400", "Nestle" },
                    { 6, "https://picsum.photos/seed/ikea/400/400", "Ikea" }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Image", "Name" },
                values: new object[,]
                {
                    { 3, "https://picsum.photos/seed/groceries/400/400", "Groceries" },
                    { 4, "https://picsum.photos/seed/home/400/400", "Home" },
                    { 5, "https://picsum.photos/seed/beauty/400/400", "Beauty" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "BrandId", "CategoryId", "Description", "ImageCover", "Price", "RatingsAverage", "Title" },
                values: new object[] { 7, 2, 2, "A light dress for warm days.", "https://picsum.photos/seed/dress/600/600", 1400m, 4.3m, "Zara Summer Dress" });

            migrationBuilder.InsertData(
                table: "SubCategories",
                columns: new[] { "Id", "CategoryId", "Name" },
                values: new object[] { 4, 2, "Women" });

            migrationBuilder.InsertData(
                table: "ProductImages",
                columns: new[] { "Id", "ProductId", "Url" },
                values: new object[] { 8, 7, "https://picsum.photos/seed/dress/600/600" });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "BrandId", "CategoryId", "Description", "ImageCover", "Price", "RatingsAverage", "Title" },
                values: new object[,]
                {
                    { 4, 3, 1, "A phone with a bright screen and a strong camera.", "https://picsum.photos/seed/iphone/600/600", 42000m, 4.8m, "Apple iPhone" },
                    { 5, 3, 1, "A thin laptop for study and design work.", "https://picsum.photos/seed/macbook/600/600", 55000m, 4.7m, "Apple Laptop" },
                    { 6, 4, 2, "Light shoes for daily walks and running.", "https://picsum.photos/seed/shoes/600/600", 3200m, 4.6m, "Nike Running Shoes" },
                    { 8, 5, 3, "A one-liter box of milk.", "https://picsum.photos/seed/milk/600/600", 35m, 4.4m, "Nestle Milk Box" },
                    { 9, 5, 3, "One kilogram of red apples.", "https://picsum.photos/seed/apples/600/600", 45m, 4.1m, "Fresh Red Apples" },
                    { 10, 6, 4, "A non-stick pan for everyday cooking.", "https://picsum.photos/seed/pan/600/600", 650m, 4.2m, "Ikea Kitchen Pan" },
                    { 11, 6, 4, "A small lamp for a study desk.", "https://picsum.photos/seed/lamp/600/600", 480m, 4.0m, "Ikea Desk Lamp" },
                    { 12, 2, 5, "A light cream for everyday skincare.", "https://picsum.photos/seed/cream/600/600", 220m, 4.5m, "Daily Face Cream" }
                });

            migrationBuilder.InsertData(
                table: "SubCategories",
                columns: new[] { "Id", "CategoryId", "Name" },
                values: new object[,]
                {
                    { 5, 3, "Fruit" },
                    { 6, 3, "Dairy" },
                    { 7, 4, "Kitchen" },
                    { 8, 5, "Skincare" }
                });

            migrationBuilder.InsertData(
                table: "ProductImages",
                columns: new[] { "Id", "ProductId", "Url" },
                values: new object[,]
                {
                    { 5, 4, "https://picsum.photos/seed/iphone/600/600" },
                    { 6, 5, "https://picsum.photos/seed/macbook/600/600" },
                    { 7, 6, "https://picsum.photos/seed/shoes/600/600" },
                    { 9, 8, "https://picsum.photos/seed/milk/600/600" },
                    { 10, 9, "https://picsum.photos/seed/apples/600/600" },
                    { 11, 10, "https://picsum.photos/seed/pan/600/600" },
                    { 12, 11, "https://picsum.photos/seed/lamp/600/600" },
                    { 13, 12, "https://picsum.photos/seed/cream/600/600" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "SubCategories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "SubCategories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "SubCategories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "SubCategories",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "SubCategories",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
