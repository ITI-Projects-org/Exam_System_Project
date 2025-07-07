export interface IExam {
    Id:string,
    Title:string,
    MaxDegree:number,
    MinDegree:number,
    StartDate: Date,
    Duration: number,
    CourseId : number,
    TeacherId: number
}
