using backend.DTOs;
using backend.Models;
using ELearning.UnitOfWorks;
//using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public UnitOfWork _unit { get; }
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signIn;
        public AccountController(UnitOfWork unit, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signIn)
        {
            _unit = unit;
            this.userManager = userManager;
            this.signIn = signIn;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDTO userDTO) {
            // Teacher or Student
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (userDTO.Role == "Teacher")
            {
                Teacher teacher = new Teacher()
                {
                    UserName = userDTO.UserName,
                    FirstName = userDTO.UserName,
                    LastName = userDTO.UserName,
                    //LastName = userDTO.LastNamez
                };
                var result = await userManager.CreateAsync(teacher, userDTO.Password);
                if (!result.Succeeded)
                    return BadRequest(result);

                await userManager.AddToRoleAsync(teacher, "Teacher");

                return Ok("Welcome teacher");
            }
            else if (userDTO.Role == "Student")
            {
                Student student = new Student()
                {
                    UserName = userDTO.UserName,
                    FirstName = userDTO.UserName,
                    LastName = userDTO.UserName,
                };
                var result = await userManager.CreateAsync(student, userDTO.Password);
                if (!result.Succeeded)
                    return Ok("Welcome student");
                //_unit.StudentRepository.Add(student);
                await userManager.AddToRoleAsync(student, "Student");
                return Ok("Done");
            }
            return BadRequest("no path selected");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not Valid Data");

            ApplicationUser user = await userManager.FindByNameAsync(userDTO.UserName);
            if (user == null)
                return Unauthorized("Invalid UserName or Password");

            var result = await signIn.PasswordSignInAsync(user, userDTO.Password, userDTO.SavePassword, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return Ok("Login Succeded");
            }
            else 
                return BadRequest("Not Succedd to login");
        }
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            signIn.SignOutAsync();
            return Ok("Logged out");
        }
    }
}
