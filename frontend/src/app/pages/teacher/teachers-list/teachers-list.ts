import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/Teacher-service';
import { Observable } from 'rxjs';
import { Iteacher } from '../../../models/iteacher';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teachers-list',
  imports: [CommonModule],
  templateUrl: './teachers-list.html',
  styleUrls: ['./teachers-list.css'],
})
// export class TeachersList implements OnInit {
//   // teacher_lists$!: Observable<Iteacher[]>;
//   teacher_lists: Iteacher[] = [];
//   constructor(private teacher: BackendService,private cdr : ChangeDetectorRef){}
//   // ngOnInit(): void {

//   //   this.teacher_lists$ = this.teacher.GetAllTeachers();
//   //   console.log(this.teacher_lists$);
//   //   // console.log(this.teacher.GetAllTeachers());
//   //   this.teacher_lists$.subscribe(data => {
//   //     console.log('TEACHERS:', data);
//   //     this.cdr.detectChanges();
//   //   });

//   // }

//   ngOnInit(): void {
//     this.teacher.GetAllTeachers().subscribe({

//         next:(data:Iteacher[])=>{
//           this.teacher_lists = data;
//           this.cdr.detectChanges(); // Ensure the view is updated with the new product data
//           console.log(this.teacher_lists);
//           console.log(this.teacher_lists.map(t => t.firstName));

//         },
//       error: (err) => {
//         console.error('Error fetching teachers:', err);
//       }
//     });
//   }
// }
export class TeachersList implements OnInit {
  teacher_lists$!: Observable<Iteacher[]>;
  constructor(private teacher: BackendService) {}

  ngOnInit(): void {
    this.teacher_lists$ = this.teacher.GetAllTeachers();
  }
}
