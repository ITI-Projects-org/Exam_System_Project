using System.Runtime.CompilerServices;
using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mapping
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Student, StudentDTO>();




        }
    }
}
