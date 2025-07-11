using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public IUnitOfWork _unit { get; }
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signIn;
        private readonly IConfiguration _config;
        IMapper _map;
        public AccountController(IUnitOfWork unit, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signIn, IMapper map, IConfiguration config)
        {
            _unit = unit;
            this.userManager = userManager;
            this.signIn = signIn;
            _map = map;
            _config = config;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDTO userDTO)
        {
            // Teacher or Student
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var existing = await userManager.FindByEmailAsync(userDTO.Email);
            if (existing != null)
            {
                return BadRequest(new
                {
                    errors = new[] { "This email is already registered." }
                });
            }
            Student student = _map.Map<Student>(userDTO);
            student.Role = UserRole.Student;
            var result = await userManager.CreateAsync(student, userDTO.Password);
            if (!result.Succeeded)
            {
                // return an array of error messages
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }
            await userManager.AddToRoleAsync(student, "Student");
            return Ok(new { msg = "registered successfully" });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { errors = new[] { "Invalid request data" } });

            ApplicationUser user = await userManager.FindByEmailAsync(userDTO.Email);
            if (user == null)
                return Unauthorized(new { errors = new[] { "Invalid email or password" } });

            if (!await userManager.CheckPasswordAsync(user, userDTO.Password))
                return Unauthorized(new { errors = new[] { "Invalid email or password" } });

            var found = await userManager.CheckPasswordAsync(user, userDTO.Password);
            if (found)
            {
                var roles = await userManager.GetRolesAsync(user);
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                };

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = _config["JwtKey"]!;
                var secrectKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
                var siginingCred = new SigningCredentials(secrectKey, SecurityAlgorithms.HmacSha256);


                var tokenObject = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: siginingCred
                    );

                var token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
                return Ok(new { token = token });
            }
            else
                return Unauthorized("Invalid Email or Password");
        }
    }
}