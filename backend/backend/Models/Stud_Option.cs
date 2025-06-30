using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [PrimaryKey(nameof(StudentId), nameof(OptionId))]

    public class Stud_Option
    {
        [Required]
        public string StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public virtual Student Student { get; set; }
        [Required]
        public int OptionId { get; set; }
        [ForeignKey(nameof(OptionId))]
        public virtual Option Option { get; set; }
    }
}
