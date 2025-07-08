import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IExam } from '../../models/iexam';
import { RouterLink } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams implements OnInit, OnDestroy{
  Exams: IExam[]=[];
  examObservable!: Subscription;
  mySubDel!: Subscription;
  ads:string[]=[];
  
  // UI State
  loading: boolean = false;
  searchTerm: string = '';
  currentFilter: string = 'all';
  activeMenu: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  constructor( private ExamTestServices:ExamServices, private cdr:ChangeDetectorRef){
  }
  
  ngOnDestroy(): void {
    this.examObservable.unsubscribe();
  }
  
  ngOnInit(): void {
    this.loading = true;
    console.log('Loading exams...');
    
    // Add some mock data for testing if no exams are loaded
    const mockExams: IExam[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        startDate: new Date('2024-01-15T10:00:00'),
        endDate: new Date('2024-01-15T12:00:00'),
        duration: 120,
        maxDegree: 100,
        minDegree: 50,
        courseId: 1,
        teacherId: 1,
        questions: []
      },
      {
        id: '2',
        title: 'Angular Development',
        startDate: new Date('2024-01-20T14:00:00'),
        endDate: new Date('2024-01-20T16:00:00'),
        duration: 120,
        maxDegree: 100,
        minDegree: 50,
        courseId: 2,
        teacherId: 1,
        questions: []
      },
      {
        id: '3',
        title: 'Database Design',
        startDate: new Date('2024-01-10T09:00:00'),
        endDate: new Date('2024-01-10T11:00:00'),
        duration: 120,
        maxDegree: 100,
        minDegree: 50,
        courseId: 3,
        teacherId: 1,
        questions: []
      }
    ];
    
    this.examObservable = this.ExamTestServices.getExams().subscribe({
      next:(exam)=>{
        console.log('Exams loaded:', exam);
        this.Exams = exam && exam.length > 0 ? exam : mockExams;
        this.calculateTotalPages();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        // Use mock data if API fails
        this.Exams = mockExams;
        this.calculateTotalPages();
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete:()=>{
        console.log('Exams loading completed');
      }
    });
  }

  // Filter and Search Methods
  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1;
  }

  getFilteredExams(): IExam[] {
    let filtered = this.Exams;
    console.log('Total exams:', this.Exams.length);
    console.log('Search term:', this.searchTerm);
    console.log('Current filter:', this.currentFilter);
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(exam => 
        exam.title?.toLowerCase().includes(search) ||
        exam.courseId.toString().includes(search)
      );
      console.log('After search filter:', filtered.length);
    }
    
    // Apply status filter
    switch (this.currentFilter) {
      case 'upcoming':
        filtered = filtered.filter(exam => this.isUpcoming(exam));
        break;
      case 'active':
        filtered = filtered.filter(exam => this.isActive(exam));
        break;
      case 'completed':
        filtered = filtered.filter(exam => this.isCompleted(exam));
        break;
    }
    
    console.log('Final filtered exams:', filtered.length);
    return filtered;
  }

  // Status Methods
  getUpcomingExams(): string {
    return this.Exams.filter(exam => this.isUpcoming(exam)).length.toString();
  }

  getActiveExams(): string {
    return this.Exams.filter(exam => this.isActive(exam)).length.toString();
  }

  getTotalExams(): string {
    return this.Exams.length.toString();
  }

  isUpcoming(exam: IExam): boolean {
    const now = new Date();
    const examDate = new Date(exam.startDate);
    return examDate > now;
  }

  isActive(exam: IExam): boolean {
    const now = new Date();
    const examDate = new Date(exam.startDate);
    const endDate = new Date(examDate.getTime() + this.parseDuration(exam.duration));
    return examDate <= now && now <= endDate;
  }

  isCompleted(exam: IExam): boolean {
    const now = new Date();
    const examDate = new Date(exam.startDate);
    const endDate = new Date(examDate.getTime() + this.parseDuration(exam.duration));
    return now > endDate;
  }

  getExamStatus(exam: IExam): string {
    if (this.isActive(exam)) return 'active';
    if (this.isUpcoming(exam)) return 'upcoming';
    return 'completed';
  }

  getExamStatusText(exam: IExam): string {
    if (this.isActive(exam)) return 'Active';
    if (this.isUpcoming(exam)) return 'Upcoming';
    return 'Completed';
  }

  // Utility Methods
  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  parseDuration(duration: number | undefined): number {
    if (!duration) return 2 * 60 * 60 * 1000; // Default 2 hours
    // Convert minutes to milliseconds
    return duration * 60 * 1000;
  }

  getExamProgress(exam: IExam): number {
    // Mock progress - in real app this would come from backend
    return Math.floor(Math.random() * 100);
  }

  // UI Methods
  toggleExamMenu(examId: string): void {
    this.activeMenu = this.activeMenu === examId ? null : examId;
  }

  refreshExams(): void {
    this.ngOnInit();
  }

  // Pagination Methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.getFilteredExams().length / this.itemsPerPage);
  }

  getPaginationInfo(): { start: number; end: number; total: number } {
    const total = this.getFilteredExams().length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, total);
    return { start, end, total };
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Delete Method
  deleteExam(id:string):void{
    if (confirm('Are you sure you want to delete this exam?')) {
      this.mySubDel = this.ExamTestServices.deleteExam(id).subscribe({
        next:(exam)=>{
          this.Exams.splice(this.Exams.indexOf(exam),1)
          this.calculateTotalPages();
          this.cdr.detectChanges();
        },
        error:(err)=>{
          console.log(err);
          this.mySubDel.unsubscribe();
        },
        complete:()=>{
          this.mySubDel.unsubscribe();
        }
      });
    }
  }  
}
