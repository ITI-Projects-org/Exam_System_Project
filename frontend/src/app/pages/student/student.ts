import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentCoursesServices } from '../../services/student-courses-services';
import { ICourses } from '../../models/ICourses';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-student',
  imports: [FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class Student implements OnInit {
  Courses: ICourses[] = [];
  selectedCourse: ICourses = { id: '0', name: '' };
  searchTerm: string = '';

  constructor(
    private studentService: StudentCoursesServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentService.getAllCourses().subscribe({
      next: (response) => {
        this.Courses = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openEditModal(course: ICourses) {
    this.selectedCourse = { ...course };
  }

  saveEdit() {
    this.studentService
      .editCourse(this.selectedCourse.id, this.selectedCourse)
      .subscribe({
        next: () => {
          //Update Locally
          this.Courses = this.Courses.map((course) =>
            course.id === this.selectedCourse.id
              ? { ...this.selectedCourse }
              : course
          );

          //hide the model
          bootstrap.Modal.getInstance(
            document.getElementById('editCourseModal')
          )?.hide();
          // Trigger change detection
          this.cdr.detectChanges();
          console.log(this.Courses);
        },
        error: (err) => console.error(err),
      });
  }

  search() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.Courses = [...this.Courses];
    } else {
      this.Courses = this.Courses.filter((course) =>
        course.name.toLowerCase().includes(term)
      );
    }
  }

  // deleteCourse(courseId: string) {
  //   this.studentService.deleteCourse(courseId).subscribe({
  //     next: () => {
  //       this.Courses = this.Courses.filter((c) => c.id != courseId);
  //       this.cdr.detectChanges();
  //     },
  //   });
  // }

  // openDeleteModal(course: ICourses) {
  //   this.selectedCourse = course;
  // }

  // confirmDeleteCourse() {
  //   if (this.selectedCourse) {
  //     this.deleteCourse(this.selectedCourse.id);
  //   }
  // }
}
