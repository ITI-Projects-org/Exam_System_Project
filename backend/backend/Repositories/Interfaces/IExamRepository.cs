﻿using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExamRepository : IGenericRepository<Exam>
    {
        Task<IEnumerable<Exam>> GetAllExamsofTeacher(string Teacher_Id);
        Task<IEnumerable<Exam>> GetAllExamsofStudent(string Student_ID);
        void AssignStudsToExam(int ExamId, ICollection<string> StudentsId);
        void CloseExam(string Student_ID, int ExamID);
        Task<Exam> TakeExam(string Student_ID, int ExamID);
        Task<Exam> GetStudentExamById(string UserId, int examId);
        Task<Exam> GetExamByIdWithWithQuestionsWithOptions(int ExamId);
        void Remove(Exam exam);
        void Update(Exam exam);
        List<Student> GetAllExamStudents(int examId);
        Task GetStudentExamRecord(string? studentId, int examId);
    }
}