using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [PrimaryKey(nameof(StudentId), nameof(ExamId))]
    public class Stud_Exam
    {
        [Required]
        public string StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public virtual Student? Student { get; set; }

        [Required]
        public int ExamId { get; set; }

        [ForeignKey(nameof(ExamId))]
        public virtual Exam? Exam { get; set; }

        [Required]
        public DateTime StudStartDate { get; set; }

        [Required]
        public DateTime StudEndDate { get; set; }

        [Required]
        public int StudDegree { get; set; }

        public bool IsAbsent { get; set; } = true;
    }
}
