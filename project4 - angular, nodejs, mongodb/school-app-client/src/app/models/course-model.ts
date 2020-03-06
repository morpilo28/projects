import { StudentModel } from './student-model';

export interface CourseModel {
    _id?: string;
    name?: string;
    description?: string;
    image?: string;
    courseStudents?:StudentModel[];
}
