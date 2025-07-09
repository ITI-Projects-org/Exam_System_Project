using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.MapperConfig
{
    public class MappingConfigurations : Profile
    {
        public MappingConfigurations()
        {
            CreateMap<Student, StudentDTO>();

            CreateMap<Student, StudentDetailsDTO>()
                .ForMember(dest => dest.StudCourses, opt => opt.MapFrom(src => src.StudCourses))
                .ForMember(dest => dest.StudExams, opt => opt.MapFrom(src => src.StudExams))
                .ForMember(dest => dest.StudOptions, opt => opt.MapFrom(src => src.StudOptions));

            CreateMap<Stud_Course, StudentCourseDTO>()
                .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.Course.Name));

            CreateMap<Stud_Exam, StudentExamDTO>()
                .ForMember(dest => dest.ExamTitle, opt => opt.MapFrom(src => src.Exam.Title));

            CreateMap<Stud_Option, StudentOptionDTO>()
                .ForMember(dest => dest.OptionTitle, opt => opt.MapFrom(src => src.Option.Title))
                .ForMember(dest => dest.IsCorrect, opt => opt.MapFrom(src => src.Option.IsCorrect))
                .ForMember(dest => dest.QuestionId, opt => opt.MapFrom(src => src.Option.QuestionId));
                //.ForMember(dest => dest.QuestionTitle, opt => opt.MapFrom(src => src.Option.Question.Title));

            CreateMap<Student, RegisterDTO>().ReverseMap();
            CreateMap<Teacher, TeacherDTO>().ReverseMap();
            CreateMap<Exam,ExamDTO>().ReverseMap();
            CreateMap<Exam,DuringExamDTO>().ReverseMap();
            CreateMap<Exam, AfterExamEndDTO>().ReverseMap();
            CreateMap<Question,QuestionForExamDTO>().ReverseMap();
            CreateMap<Option, OptionForExamDTO>().ReverseMap();
            CreateMap<Option, DuringOptionForExamDTO>().ReverseMap();
            CreateMap<Question, DuringQuestionForExamDTO>().ReverseMap();
            CreateMap<Exam,ExamInputDTO>().ReverseMap();
        }
    }
}
