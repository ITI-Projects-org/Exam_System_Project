using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [PrimaryKey(nameof(StudentId), nameof(CourseId))]
    public class Stud_Course
    {
        [Required]
        public string StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public virtual Student Student { get; set; }
        [Required]
        public int CourseId { get; set; }
        [ForeignKey(nameof(CourseId))]
        public virtual Course Course { get; set; }
        public int StudentDegree { get; set; }
    }
}
