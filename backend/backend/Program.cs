
using AutoMapper;
using backend.Models;
using ELearning.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Proxies;
using Microsoft.Identity.Client;
using static System.Net.Mime.MediaTypeNames;

namespace backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            string txt = "";

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.  

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi  

            // Fixing CS1061: Correcting the method name to 'UseLazyLoadingProxies'  
            builder.Services.AddDbContext<ExamSysContext>(options =>
                options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddAutoMapper(typeof(Mapper));

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


            builder.Services.AddCors(options =>
            {
                options.AddPolicy(txt,
                builder =>
                {
                    builder.AllowAnyOrigin();
                     builder.WithOrigins("https://localhost:7088");
                    builder.WithMethods("Post","get");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });
            builder.Services.AddOpenApi();  
            builder.Services.AddScoped<UnitOfWork, UnitOfWork>();
            //builder.Services.AddScoped<>


            var app = builder.Build();

            // Seed the database
            // comment out after finishing
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

            app.MapControllers();

            await app.RunAsync(); // Changed to RunAsync to match the async Main method
        }
    }
}
