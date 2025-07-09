import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamServices, Student } from '../../services/exam-services';

@Component({
  selector: 'app-assign-student-to-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-student-to-exam.html',
  styleUrls: ['./assign-student-to-exam.css']
})
export class AssignStudentToExamComponent implements OnInit {
  examId: number = 0;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  selectedStudents: Set<string> = new Set();
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudents();
    this.cdr.detectChanges();
  }

  loadStudents() {
    this.loading = true;
    this.error = '';
    
    this.examService.getAllStudents().subscribe({
      next: (students) => {
        
        console.log('Loaded students:', students);
        this.students = students;
        this.filteredStudents = students;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.error = 'Failed to load students';
        this.loading = false;
      }
    });
  }

  filterStudents() {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = this.students;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredStudents = this.students.filter(student =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      );
    }
  }

  toggleStudent(studentId: string) {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  selectAll() {
    this.filteredStudents.forEach(student => {
      this.selectedStudents.add(student.id);
    });
  }

  deselectAll() {
    this.selectedStudents.clear();
  }

  assignStudents() {
    if (this.selectedStudents.size === 0) {
      this.error = 'Please select at least one student';
      return;
    }

    this.loading = true;
    this.error = '';
    
    const studentIds = Array.from(this.selectedStudents);
    console.log('Assigning students:', studentIds, 'to exam:', this.examId);

    this.examService.assignStudentsToExam(this.examId, studentIds).subscribe({
      next: (response) => {
        console.log('Students assigned successfully:', response);
        this.loading = false;
        // Navigate back to exam details
        this.router.navigate(['/exams', this.examId]);
      },
      error: (err) => {
        console.error('Error assigning students:', err);
        this.error = 'Failed to assign students';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/exams', this.examId]);
  }
} 