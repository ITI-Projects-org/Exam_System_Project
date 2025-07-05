using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Azure.Core;
using backend.DTOs;
using backend.Models;
using Castle.Components.DictionaryAdapter;
using ELearning.UnitOfWorks;
//using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public UnitOfWork _unit { get; }
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signIn;
        IMapper _map;
        public AccountController(UnitOfWork unit, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signIn, IMapper map)
        {
            _unit = unit;
            this.userManager = userManager;
            this.signIn = signIn;
            _map = map;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDTO userDTO)
        {
            // Teacher or Student
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Student student = _map.Map<Student>(userDTO);
            student.Role = UserRole.Student;
            var result = await userManager.CreateAsync(student, userDTO.Password);
            if (!result.Succeeded)
                return BadRequest(result);
            await userManager.AddToRoleAsync(student, "Student");
            return Ok("Done");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not Valid Data");

            ApplicationUser user = await userManager.FindByEmailAsync(userDTO.Email);
            if (user == null)
                return Unauthorized("Invalid Email or Password");

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

                var key = "this is my secrect key for the WebAPI/Angular project";
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
