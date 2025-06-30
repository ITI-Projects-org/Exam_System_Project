using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(1000)]
        public string Title { get; set; }
        [Required]
        public int Degree { get; set; }
        [Required]
        public int ExamId { get; set; }
        [ForeignKey(nameof(ExamId))]
        public virtual Exam Exam { get; set; }
        public virtual ICollection<Option> Options { get; set; }
    }
}
