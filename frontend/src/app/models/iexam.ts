export interface IExam {
    id: string,
    title:string,
    startDate: Date,
    endDate: Date,
    duration: number,
    maxDegree: number,
    minDegree: number,
    courseId : number,
    teacherId: number,
    questions: IQuestion[]
}

export interface IQuestion{
    id: string,
    title: string,
    degree: number,
    options:IOption[]
    
}
export interface IOption{
    id: string,
    title: string,
    isCorrect: boolean,
    isChoosedByStudent: boolean
}