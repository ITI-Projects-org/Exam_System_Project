import { IpcNetConnectOpts } from 'net';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IExam } from '../../models/iexam';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamServices } from '../../services/exam-services';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})
export class ExamDetails implements OnInit{
  Exam: IExam | null = null;
  mySub!:Subscription;
  Id! : string | null;
  
  constructor(private ExamTest:ExamServices, private activatedRoute:ActivatedRoute, private cdr:ChangeDetectorRef){
    
  }

  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id')??'';
    this.mySub = this.ExamTest.getExamById(this.Id).subscribe({
      next: (exams) => {
        if (Array.isArray(exams)) 
          this.Exam = exams[0];
         else 
          this.Exam = exams;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading exam:', error);
      }
    });
  }

  // Status Methods
  getExamStatus(): string {
    if (!this.Exam) return 'loading';
    const now = new Date();
    const examDate = new Date(this.Exam.startDate);
    const endDate = new Date(this.Exam.endDate);
    
    if (now < examDate) return 'upcoming';
    if (now >= examDate && now <= endDate) return 'active';
    return 'completed';
  }

  getExamStatusText(): string {
    const status = this.getExamStatus();
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return 'Loading...';
    }
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

  getPassPercentage(): number {
    if (!this.Exam) return 0;
    return Math.round((this.Exam.minDegree / this.Exam.maxDegree) * 100);
  }

  // Time Methods
  getTimeRemaining(): string {
    if (!this.Exam) return '--:--:--';
    
    const now = new Date();
    const startDate = new Date(this.Exam.startDate);
    const endDate = new Date(this.Exam.endDate);
    
    if (now < startDate) {
      // Time until start
      const diff = startDate.getTime() - now.getTime();
      return this.formatTimeRemaining(diff);
    } else if (now >= startDate && now <= endDate) {
      // Time remaining
      const diff = endDate.getTime() - now.getTime();
      return this.formatTimeRemaining(diff);
    } else {
      return '00:00:00';
    }
  }

  getTimeStatusText(): string {
    if (!this.Exam) return 'Loading...';
    
    const now = new Date();
    const startDate = new Date(this.Exam.startDate);
    const endDate = new Date(this.Exam.endDate);
    
    if (now < startDate) return 'Until Start';
    if (now >= startDate && now <= endDate) return 'Time Remaining';
    return 'Exam Ended';
  }

  getTimeStatusClass(): string {
    const status = this.getExamStatus();
    switch (status) {
      case 'upcoming': return 'upcoming';
      case 'active': return 'active';
      case 'completed': return 'completed';
      default: return 'loading';
    }
  }

  getTimeProgress(): number {
    if (!this.Exam) return 0;
    
    const now = new Date();
    const startDate = new Date(this.Exam.startDate);
    const endDate = new Date(this.Exam.endDate);
    
    if (now < startDate) {
      return 0;
    } else if (now >= startDate && now <= endDate) {
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } else {
      return 100;
    }
  }

  private formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return '00:00:00';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
