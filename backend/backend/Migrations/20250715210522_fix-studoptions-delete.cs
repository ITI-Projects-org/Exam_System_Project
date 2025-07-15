using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class fixstudoptionsdelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudOptions_Options_OptionId",
                table: "StudOptions");

            migrationBuilder.AddForeignKey(
                name: "FK_StudOptions_Options_OptionId",
                table: "StudOptions",
                column: "OptionId",
                principalTable: "Options",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudOptions_Options_OptionId",
                table: "StudOptions");

            migrationBuilder.AddForeignKey(
                name: "FK_StudOptions_Options_OptionId",
                table: "StudOptions",
                column: "OptionId",
                principalTable: "Options",
                principalColumn: "Id");
        }
    }
}
