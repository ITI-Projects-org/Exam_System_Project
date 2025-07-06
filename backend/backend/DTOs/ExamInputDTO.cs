using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ExamInputDTO
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public TimeSpan Duration { get; set; }

        [Required]
        public int CourseId { get; set; } // Fixed property name

        [Required]
        public int MaxDegree { get; set; }

        [Required]
        public int MinDegree { get; set; }

        public bool IsAbsent { get; set; }

        public List<StudentOptionInputDTO> Stud_Options { get; set; } = new List<StudentOptionInputDTO>();

        public List<QuestionForExamDTO> Questions { get; set; } = new List<QuestionForExamDTO>();

        public int StudDegree { get; set; }
    }
    public class StudentOptionInputDTO
    {
        public int? Id { get; set; }
        public string StudentId { get; set; }
        public int OptionId { get; set; }
        public int ExamId { get; set; }
        // Add other properties as needed
    }
}
