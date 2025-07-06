using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class ExamSysContext : IdentityDbContext<ApplicationUser>
    {
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<Teacher> Teachers { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<Exam> Exams { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<Option> Options { get; set; }
        public virtual DbSet<Stud_Course> StudCourses { get; set; }
        public virtual DbSet<Stud_Exam> StudExams { get; set; }
        public virtual DbSet<Stud_Option> StudOptions { get; set; }

        public ExamSysContext(DbContextOptions<ExamSysContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure user discriminator
            builder.Entity<ApplicationUser>()
                .HasDiscriminator<string>("UserType")
                .HasValue<ApplicationUser>("Base")
                .HasValue<Student>("Student")
                .HasValue<Teacher>("Teacher");

            // Configure indexes
            builder.Entity<Course>()
                .HasIndex(c => c.Name);

            builder.Entity<Exam>()
                .HasIndex(e => e.Title);

            // Configure foreign key relationships with proper delete behavior

            //Course->Teacher(NO ACTION to prevent cascade conflicts)
            //builder.Entity<Course>()
            //    .HasOne(c => c.Teacher)
            //    .WithMany(t => t.Courses)
            //    .HasForeignKey(c => c.TeacherId)
            //    .OnDelete(DeleteBehavior.NoAction);

            // Exam -> Course (RESTRICT)
            builder.Entity<Exam>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Exams)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Exam -> Teacher (NO ACTION to prevent cascade conflicts)
            builder.Entity<Exam>()
                .HasOne(e => e.Teacher)
                .WithMany()
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.NoAction);

<<<<<<< HEAD
            // Question -> Exam (RESTRICT)
=======
            //Question -> Exam(RESTRICT)
>>>>>>> df4f6b6aa3829e2bb755059cbd6b24a8b3f491dc
            builder.Entity<Question>()
                .HasOne(q => q.Exam)
                .WithMany(e => e.Questions)
                .HasForeignKey(q => q.ExamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Option -> Question (CASCADE is fine here)
            builder.Entity<Option>()
                .HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure junction table relationships

            // StudCourse -> Student (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Course>()
                .HasOne(sc => sc.Student)
                .WithMany(s => s.StudCourses)
                .HasForeignKey(sc => sc.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            // StudCourse -> Course (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Course>()
                .HasOne(sc => sc.Course)
                .WithMany()
                .HasForeignKey(sc => sc.CourseId)
                .OnDelete(DeleteBehavior.NoAction);

            // StudExam -> Student (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Exam>()
                .HasOne(se => se.Student)
                .WithMany(s => s.StudExams)
                .HasForeignKey(se => se.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            // StudExam -> Exam (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Exam>()
                .HasOne(se => se.Exam)
                .WithMany()
                .HasForeignKey(se => se.ExamId)
                .OnDelete(DeleteBehavior.NoAction);

            // StudOption -> Student (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Option>()
                .HasOne(so => so.Student)
                .WithMany(s => s.StudOptions)
                .HasForeignKey(so => so.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            // StudOption -> Option (NO ACTION to prevent cascade conflicts)
            builder.Entity<Stud_Option>()
                .HasOne(so => so.Option)
                .WithMany()
                .HasForeignKey(so => so.OptionId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
