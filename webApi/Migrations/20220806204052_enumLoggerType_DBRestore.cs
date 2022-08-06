using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webApi.Migrations
{
    public partial class enumLoggerType_DBRestore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LoggerType",
                table: "Logger",
                newName: "loggerType");

            migrationBuilder.AlterColumn<int>(
                name: "loggerType",
                table: "Logger",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "loggerType",
                table: "Logger",
                newName: "LoggerType");

            migrationBuilder.AlterColumn<string>(
                name: "LoggerType",
                table: "Logger",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
