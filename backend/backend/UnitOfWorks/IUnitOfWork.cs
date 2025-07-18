﻿using backend.Repositories.Interfaces;

namespace backend.UnitOfWorks
{
    public interface IUnitOfWork : IDisposable
    {
        IStudentRepository StudentRepository { get; }
        ITeacherRepository TeacherRepository { get; }
        IExamRepository ExamRepository { get; }
        IQuestionRepository QuestionRepository { get; }
        IOptionRepository OptionRepository { get; }
        ICourseRepository CourseRepository { get; }
        IStudentExamRepository StudentExamRepository { get; }
        IStudentOptionRepository StudentOptionRepository { get; }

        Task SaveAsync(); // Changed to async
    }
}