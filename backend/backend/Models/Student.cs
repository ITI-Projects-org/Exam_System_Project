namespace backend.Models
{
    public class Student : ApplicationUser
    {
        public virtual ICollection<Stud_Course>? StudCourses { get; set; }
        public virtual ICollection<Stud_Exam>? StudExams { get; set; }
        public virtual ICollection<Stud_Option>? StudOptions { get; set; }
    }
}
