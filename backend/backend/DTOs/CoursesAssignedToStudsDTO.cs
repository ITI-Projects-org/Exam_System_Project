using backend.Models;

namespace backend.DTOs
{
    public class CoursesAssignedToStudsDTO
    {
        public  List<string>? StudentsIds { get; set; } = new();
        public List<int>? CoursesIds { get; set; } = new();


    }
}
