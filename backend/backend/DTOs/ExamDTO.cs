using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ExamDTO
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
        public DateTime EndDate
        {
            get
            {
                return StartDate + Duration;
            }
        }

        [Required]
        public int MaxDegree { get; set; }

        [Required]
        public int MinDegree { get; set; }
    }
}
