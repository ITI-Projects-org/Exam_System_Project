using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    [NotMapped]
    public class RegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public String Role { get; set; }

        [Required]
        public string Password { get; set; }

        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        public bool SavePassword { get; set; }
    }
}
