import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentCoursesServices } from '../../services/student-courses-services';
import { ICourses } from '../../models/ICourses';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/Teacher-service';

declare var bootstrap: any;

@Component({
  selector: 'app-courses',
  imports: [FormsModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
})
export class Courses implements OnInit {
  allCourses: ICourses[] = [];
  Courses: ICourses[] = [];
  selectedCourse: ICourses = { id: '0', name: '' };
  searchTerm: string = '';
  newCourseName: string = '';
  addedCourse: ICourses = {
    id: '',
    name: '',
  };

  constructor(
    private studentService: StudentCoursesServices,
    private TeacherService: BackendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentService.getAllCourses().subscribe({
      next: (response) => {
        this.allCourses = response;
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
        },
        error: (err) => console.error(err),
      });
  }

  saveNewCourse() {
    if (!this.newCourseName.trim()) {
      return;
    }

    this.TeacherService.AddCourse(this.newCourseName).subscribe({
      next: (res: any) => {
        console.log('added course', res);
        // build an ICourses object from the real JSON keys:
        const course: ICourses = {
          id: (res.Id ?? res.id).toString(),
          name: res.Name ?? res.name,
        };

        // push that new object into your array:
        this.Courses.push(course);

        // Clear the form
        this.newCourseName = '';

        // Hide the modal
        bootstrap.Modal.getInstance(
          document.getElementById('addCourseModal')
        )?.hide();

        // Trigger change detection
        this.cdr.detectChanges();
      },
      error: (err) => console.error('error in add new course', err),
    });
  }

  search() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.Courses = [...this.allCourses];
    } else {
      this.Courses = this.Courses.filter((course) =>
        course.name.toLowerCase().includes(term)
      );
    }
  }
}
