﻿using backend.Models;
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

    [NotMapped]
    public class DuringExamDTO
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
        public ICollection<DuringQuestionForExamDTO> Questions { get; set; }
    }

    public class DuringOptionForExamDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        //public bool? IsCorrect { get; set; }
        //public bool IsChoosedByStudent { get; set; } = false;
    }



    public class DuringQuestionForExamDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Degree { get; set; }
        public ICollection<DuringOptionForExamDTO> Options { get; set; }
    }
    public class QuestionForExamDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Degree { get; set; }
        public ICollection<OptionForExamDTO> Options { get; set; }
    }

    public class OptionForExamDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool? IsCorrect { get; set; }
        public bool IsChoosedByStudent { get; set; } = false;
    }

    public class AfterExamEndDTO
    {
        public int CourseId { get; set; }

        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public TimeSpan Duration { get; set; }
        public int MaxDegree { get; set; }
        public int MinDegree { get; set; }
        public bool IsAbsent { get; set; }
        public List<Stud_Option> stud_Options { get; set; }
        //public List<Option> Options { get; set; }
        public ICollection<QuestionForExamDTO> Questions { get; set; }

        public int StudDegree { get; set; }
    }

    public class ExamStudentDegreeDTO
    {
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int Degree { get; set; }
        public bool IsAbsent { get; set; }
    }

    // DTO for submitted answers
    public class ExamSubmitAnswerDTO
    {
        public int QuestionId { get; set; }
        public List<int> OptionIds { get; set; }
    }
}