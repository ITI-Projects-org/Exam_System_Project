using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Seed Roles
            await SeedRolesAsync(roleManager);

            // Seed Users
            await SeedUsersAsync(userManager);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Student", "Teacher" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
        {
            // Seed Students
            await SeedStudentAsync(userManager, "student1@example.com", "Student", "One", "Student123!");
            await SeedStudentAsync(userManager, "student2@example.com", "Student", "Two", "Student123!");

            // Seed Teachers  
            await SeedTeacherAsync(userManager, "teacher1@example.com", "Teacher", "One", "Teacher123!");
            await SeedTeacherAsync(userManager, "teacher2@example.com", "Teacher", "Two", "Teacher123!");
        }

        private static async Task SeedStudentAsync(UserManager<ApplicationUser> userManager,
            string email, string firstName, string lastName, string password)
        {
            if (await userManager.FindByEmailAsync(email) == null)
            {
                var student = new Student
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(student, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(student, "Student");
                }
            }
        }

        private static async Task SeedTeacherAsync(UserManager<ApplicationUser> userManager,
            string email, string firstName, string lastName, string password)
        {
            if (await userManager.FindByEmailAsync(email) == null)
            {
                var teacher = new Teacher
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(teacher, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(teacher, "Teacher");
                }
            }
        }
    }
}
