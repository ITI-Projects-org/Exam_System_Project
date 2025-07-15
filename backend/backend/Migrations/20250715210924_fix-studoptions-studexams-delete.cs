using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class fixstudoptionsstudexamsdelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudExams_Exams_ExamId",
                table: "StudExams");

            migrationBuilder.AddForeignKey(
                name: "FK_StudExams_Exams_ExamId",
                table: "StudExams",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudExams_Exams_ExamId",
                table: "StudExams");

            migrationBuilder.AddForeignKey(
                name: "FK_StudExams_Exams_ExamId",
                table: "StudExams",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id");
        }
    }
}
