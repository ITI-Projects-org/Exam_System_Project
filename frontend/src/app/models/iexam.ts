export interface IExam {
    id?: number;
    title: string;
    startDate: Date;
    duration: string; // hh:mm:ss for backend
    maxDegree: number;
    minDegree: number;
    courseId: number;
    questions: IQuestion[];
    isAbsent?: boolean;
    stud_Options?: StudentOptionInputDTO[];
    studDegree?: number;
}

export interface IQuestion {
    id?: number;
    title: string;
    degree: number;
    options: IOption[];
}

export interface IOption {
    id?: number;
    title: string;
    isCorrect?: boolean;
    isChoosedByStudent?: boolean;
}

export interface StudentOptionInputDTO {
    id?: number;
    studentId: string;
    optionId: number;
    examId: number;
}