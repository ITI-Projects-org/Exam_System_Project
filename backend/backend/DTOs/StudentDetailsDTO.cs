namespace backend.DTOs
{
    public class StudentDetailsDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<StudentCourseDTO> StudCourses { get; set; }
        public ICollection<StudentExamDTO> StudExams { get; set; }
        public ICollection<StudentOptionDTO> StudOptions { get; set; }
    }

    public class StudentCourseDTO
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public int StudentDegree { get; set; }
    }

    public class StudentExamDTO
    {
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public DateTime StudStartDate { get; set; }
        public DateTime StudEndDate { get; set; }
        public int StudDegree { get; set; }
        public bool IsAbsent { get; set; }
    }

    public class StudentOptionDTO
    {
        public int OptionId { get; set; }
        public string OptionTitle { get; set; }
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
        public string QuestionTitle { get; set; }
    }
}
