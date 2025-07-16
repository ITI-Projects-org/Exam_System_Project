export interface IExam {
  id?: number;
  title: string;
  startDate: string;
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
  text: any;
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

export interface IExamListItem {
  id: number;
  title: string;
  startDate: string;
  duration: string;
  endDate: string;
  maxDegree: number;
  minDegree: number;
}
