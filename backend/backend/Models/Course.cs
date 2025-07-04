using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(25)]
        public string Name { get; set; }

        [Required]
        public string TeacherId { get; set; }

        [ForeignKey(nameof(TeacherId))]
        public virtual Teacher? Teacher { get; set; }

        public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();
    }
}
