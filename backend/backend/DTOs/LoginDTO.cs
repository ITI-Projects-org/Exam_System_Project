using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    [NotMapped]
    public class LoginDTO
    {
        [Required]
        public string UserName { get; set; }
        [MaxLength(20)]
        [Required]
        public string Role { get; set; }
        [Required]
        public string Password { get; set; }
    
        public bool SavePassword { get; set; }
    }
}
