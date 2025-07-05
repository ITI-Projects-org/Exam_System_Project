using backend.Models;
using backend.UnitOfWorks;
using backend.MapperConfig;
using backend.Repositories.Interfaces;
using backend.Repositories.Implementations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string _policy = "";

            // Add services to the container.  

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi  

            // Fixing CS1061: Correcting the method name to 'UseLazyLoadingProxies'  
            builder.Services.AddDbContext<ExamSysContext>(options =>
                options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Configure Identity options if needed  
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
            })
            .AddEntityFrameworkStores<ExamSysContext>()
            .AddDefaultTokenProviders();

            builder.Services.AddOpenApi();

            // Register Repositories and Unit of Work
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            builder.Services.AddScoped<ITeacherRepository, TeacherRepository>();
            builder.Services.AddScoped<IExamRepository, ExamRepository>();
            builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
            builder.Services.AddScoped<IOptionRepository, OptionRepository>();
            builder.Services.AddScoped<ICourseRepository, CourseRepository>();

            // Configure AutoMapper
            builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingConfigurations>());

            // Register Cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(_policy,
                builder =>
                {
                    builder.AllowAnyOrigin();
                    builder.WithOrigins("https://localhost:7088");
                    builder.WithMethods("Post", "get");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            var app = builder.Build();

            //// Seed the database
            //// comment out after finishing
            //using (var scope = app.Services.CreateScope())
            //{
            //    try
            //    {
            //        await DatabaseSeeder.SeedAsync(scope.ServiceProvider);
            //    }
            //    catch (Exception ex)
            //    {
            //        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            //        logger.LogError(ex, "An error occurred while seeding the database.");
            //    }
            //}

            // Configure the HTTP request pipeline.  
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "v1"));
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseAuthorization();

            app.MapControllers();

            await app.RunAsync(); // Changed to RunAsync to match the async Main method
        }
    }
}
