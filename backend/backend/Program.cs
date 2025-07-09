using backend.MapperConfig;
using backend.Models;
using backend.Repositories.Implementations;
using backend.Repositories.Interfaces;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

            // Register Repositories
            //builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            //builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            //builder.Services.AddScoped<ITeacherRepository, TeacherRepository>();
            //builder.Services.AddScoped<IExamRepository, ExamRepository>();
            //builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
            //builder.Services.AddScoped<IOptionRepository, OptionRepository>();
            //builder.Services.AddScoped<ICourseRepository, CourseRepository>();
            //builder.Services.AddScoped<IStudentExamRepository, StudentExamRepository>();
            //builder.Services.AddScoped<IStudentOptionRepository, StudentOptionRepository>();
            
            // Register Unit of Work
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Configure AutoMapper
            builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingConfigurations>());

            // Register Cors
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy(_policy,
            //    builder =>
            //    {
            //        builder.AllowAnyOrigin();
            //        builder.WithOrigins("https://localhost:7088");
            //        //builder.WithOrigins("http://localhost:7088");
            //        builder.WithMethods("Post", "get");
            //        builder.AllowAnyMethod();
            //        builder.AllowAnyHeader();
            //    });
            //});
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Add this before app.UseAuthorization();
            

            builder.Services.AddAuthentication(op => op.DefaultAuthenticateScheme = "auth_schema")
           .AddJwtBearer("auth_schema", options =>
           {
               var key = "this is my secrect key for the WebAPI/Angular project";
               var secrectKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));

               options.TokenValidationParameters = new TokenValidationParameters()
               {
                   IssuerSigningKey = secrectKey,
                   ValidateIssuer = false,
                   ValidateAudience = false
               };
           });


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseCors("AllowAll");
            app.UseAuthorization();
            app.MapControllers();

            await app.RunAsync(); 
        }
    }
}
