namespace backend.Models
{
    public class Teacher : ApplicationUser
    {
        public virtual ICollection<Course>? Courses { get; set; }
    }
}
