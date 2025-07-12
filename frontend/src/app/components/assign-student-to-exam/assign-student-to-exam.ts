import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamServices, Student, ExamStudentDegreeDTO } from '../../services/exam-services';
import { firstValueFrom } from 'rxjs';


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
  assignedStudents: ExamStudentDegreeDTO[] = [];
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

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe({
        next: (params) => {
          this.examId = Number(params.get('id'));
          this.loadData();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading exam ID:', err);
          this.error = 'Failed to load exam ID';
        }
      });
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.error = 'Failed to initialize component';
    }
  }

  async loadData() {
    this.loading = true;
    this.error = '';

    try {
      // Wait a bit for token initialization
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load all students and assigned students in parallel
      const [students, assignedStudents] = await Promise.all([
        firstValueFrom(this.examService.getAllStudents()),
        firstValueFrom(this.examService.getStudentsOfExam(this.examId))
      ]);

      if (students) {
        console.log('Students loaded successfully:', students);
        this.students = students;
        this.filteredStudents = students;
      }

      if (assignedStudents) {
        console.log('Assigned students loaded successfully:', assignedStudents);
        this.assignedStudents = assignedStudents;
        // Mark pre-assigned students as selected
        this.selectedStudents.clear();
        assignedStudents.forEach(assigned => {
          this.selectedStudents.add(assigned.studentId);
        });
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading data:', err);
      this.error = 'Failed to load data: ' + (err instanceof Error ? err.message : String(err));
      this.loading = false;
      this.cdr.detectChanges();
    }
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

  isStudentAssigned(studentId: string): boolean {
    return this.assignedStudents.some(assigned => assigned.studentId === studentId);
  }

  getStudentStatus(studentId: string): string {
    const isCurrentlySelected = this.selectedStudents.has(studentId);
    const wasPreviouslyAssigned = this.isStudentAssigned(studentId);

    if (isCurrentlySelected && wasPreviouslyAssigned) {
      return 'Currently Assigned';
    } else if (isCurrentlySelected && !wasPreviouslyAssigned) {
      return 'Will Be Assigned';
    } else if (!isCurrentlySelected && wasPreviouslyAssigned) {
      return 'Will Be Unassigned';
    } else {
      return 'Not Assigned';
    }
  }

  getStatusBadgeClass(studentId: string): string {
    const isCurrentlySelected = this.selectedStudents.has(studentId);
    const wasPreviouslyAssigned = this.isStudentAssigned(studentId);

    if (isCurrentlySelected && wasPreviouslyAssigned) {
      return 'bg-success';
    } else if (isCurrentlySelected && !wasPreviouslyAssigned) {
      return 'bg-primary';
    } else if (!isCurrentlySelected && wasPreviouslyAssigned) {
      return 'bg-warning';
    } else {
      return 'bg-secondary';
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
        this.error = 'Failed to assign students: ' + (err instanceof Error ? err.message : String(err));
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/exams', this.examId]);
  }
}
