import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentCoursesServices } from '../../services/student-courses-services';
import { FormsModule } from '@angular/forms';
import { ExamServices } from '../../services/exam-services';
import { IStudent } from '../../models/istudent';
import { BackendService } from '../../services/Teacher-service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class Student implements OnInit {
  students: IStudent[] = [];
  filteredStudents: IStudent[] = [];
  selectedStudent!: IStudent;
  searchTerm: string = '';

  constructor(
    private studentService: StudentCoursesServices,
    private cdr: ChangeDetectorRef,
    private examserv: ExamServices,
    private teacher: BackendService
  ) {}

  ngOnInit(): void {
    this.examserv.getAllStudents().subscribe({
      next: (response) => {
        this.students = response;
        this.filteredStudents = response;
        this.cdr.detectChanges();
        console.log('Students:', this.students);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  search() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter((s) =>
        (s.firstName + ' ' + s.lastName).toLowerCase().includes(term)
      );
    }
  }

  openDeleteModal(student: IStudent) {
    this.selectedStudent =
      this.students.find((s) => s.id === student.id) || student;
  }

  confirmDeleteStudent() {
    if (this.selectedStudent) {
      this.teacher.deleteStudent(this.selectedStudent.id).subscribe({
        next: () => {
          this.students = this.students.filter(
            (s) => s.id !== this.selectedStudent.id
          );
          this.search();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
