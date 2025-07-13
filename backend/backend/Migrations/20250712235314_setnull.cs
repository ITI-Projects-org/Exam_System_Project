using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class setnull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudCourses_AspNetUsers_StudentId",
                table: "StudCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_StudCourses_Courses_CourseId",
                table: "StudCourses");

            migrationBuilder.AddForeignKey(
                name: "FK_StudCourses_AspNetUsers_StudentId",
                table: "StudCourses",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_StudCourses_Courses_CourseId",
                table: "StudCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudCourses_AspNetUsers_StudentId",
                table: "StudCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_StudCourses_Courses_CourseId",
                table: "StudCourses");

            migrationBuilder.AddForeignKey(
                name: "FK_StudCourses_AspNetUsers_StudentId",
                table: "StudCourses",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudCourses_Courses_CourseId",
                table: "StudCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
