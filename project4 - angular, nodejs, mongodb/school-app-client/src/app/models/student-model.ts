"use strict";

import { CourseModel } from './course-model';

export interface StudentModel {
    _id?:string;
    name?:string;
    phone?:string;
    email?:string;
    image?:string;
    courses?:CourseModel[];
}
