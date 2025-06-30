using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Title { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public TimeSpan Duration { get; set; }
        [NotMapped]
        public DateTime EndDate { get {
                return StartDate + Duration;
            } }
        [Required]
        public int MaxDegree { get; set; }
        [Required]
        public int MinDegree { get; set; }
        [Required]
        public int CourseId { get; set; }
        [ForeignKey(nameof(CourseId))]
        public virtual Course Course { get; set; }

        [Required]
        public string TeacherId { get; set; }
        [ForeignKey(nameof(TeacherId))]
        public virtual Teacher Teacher { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
