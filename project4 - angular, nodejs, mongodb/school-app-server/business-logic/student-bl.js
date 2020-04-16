'use strict';
const studentCollection = 'student';
const courseCollection = 'course';
const dal = require('../dal');
const imgFolder = 'studentImages';
const studentModel = require('../models/student-model');
const courseModel = require('../models/course-model');
const deleteUtils = require('../utils/deleteImage');


function get(cb) {
    dal.get(studentCollection, (err, allStudents) => {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            allStudents = modelVariable(allStudents, studentModel.Student);
            cb(null, allStudents);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(studentCollection, id, (err, student) => {
        if (err) {
            console.log("can't get student");
        } else {
            student = modelVariable(student, studentModel.Student);
            cb(null, student);
        }
    });
}

function insertOne(studentToAdd, cb) {
    studentToAdd = modelVariable(studentToAdd, studentModel.Student);
    dal.insert(studentCollection, studentToAdd, (err, studentInserted) => {
        if (err) {
            console.log("can't insert student");
        } else {
            studentInserted = modelVariable(studentInserted, studentModel.Student);
            let studentToAddToCourse = { ...studentToAdd };
            studentToAddToCourse = modelVariable(studentToAddToCourse, studentModel.Student);
            delete studentToAddToCourse['courses'];
            for (let i = 0; i < studentToAdd.courses.length; i++) {
                dal.pushToArray(courseCollection, studentToAdd.courses[i]._id, studentToAddToCourse, (err, singleCourse) => {
                    if (err) {
                        cb("can't insert student into his checked courses");
                    } else {
                        singleCourse = modelVariable(singleCourse, courseModel.Course);
                        console.log('student was inserted into his checked course');
                    }
                });
            }
            cb(null, studentInserted);
        }
    });
}

function updateOne(studentData, cb) {
    let studentNewData = studentData.new;
    let studentOldData = studentData.old;
    studentNewData = modelVariable(studentNewData, studentModel.Student);
    studentOldData = modelVariable(studentOldData, studentModel.Student);
    dal.update(studentCollection, studentNewData, (err, studentUpdated) => {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            studentUpdated = modelVariable(studentUpdated, studentModel.Student);
            const coursesToUpdate = getCoursesToUpdate(studentData);
            delete studentNewData['courses'];

            coursesToUpdate.forEach((course) => {
                updateCourses(course, studentNewData);
            });
            cb(null, studentUpdated);
        }
    });

    function updateCourses(course, studentToAddToCourse) {
        dal.getOne(courseCollection, course._id, (err, courseData) => {
            let courseStudents = courseData.courseStudents;
            if (err) {
                console.log("can't get course");
            }
            else {
                if (course.action === 'add') {
                    let isExist = false;
                    for (let i = 0; i < courseStudents.length; i++) {
                        let student = courseStudents[i];
                        if (studentNewData._id.toString() === student._id.toString()) {
                            isExist = true;
                            courseStudents[i] = studentToAddToCourse;
                            break;
                        }
                    }
                    if (!isExist) {
                        courseStudents.push(studentToAddToCourse);
                        updateCourse(courseData);
                    } else {
                        updateCourse(courseData);
                    }
                }
                else if (course.action === 'remove') {
                    courseStudents = courseStudents.map((student, i) => {
                        if (studentNewData._id.toString() === student._id.toString()) {
                            courseStudents.splice(i, 1);
                        }
                        updateCourse(courseData);
                    });
                }
            }
        });
    }

    function getCoursesToUpdate(studentData) {
        const studentOldCourses = studentData.old.courses;
        let studentNewCourses = studentData.new.courses;
        let coursesToUpdate = [];
        let isTheSameCourse = false;
        studentNewCourses = studentNewCourses.map(course => {
            course['action'] = 'add';
            return course;
        });
        coursesToUpdate = [...studentNewCourses];
        studentOldCourses.forEach((course) => {
            for (let i = 0; i < studentNewCourses.length; i++) {
                isTheSameCourse = false;
                if (course._id.toString() === studentNewCourses[i]._id.toString()) {
                    isTheSameCourse = true;
                    break
                }
            }
            if (!isTheSameCourse) {
                course['action'] = 'remove';
                coursesToUpdate.push(course);
            }
        });

        return coursesToUpdate
    }

    function updateCourse(courseData) {
        dal.update(courseCollection, courseData, (err, courseUpdated) => {
            if (err) {
                console.log('problem with updating the course');
            }
        });
    }
}

function deleteOne(studentToDeleteId, cb) {
    dal.getOne(studentCollection, studentToDeleteId, (err, student) => {
        if (err) {
            console.log("can't get student");
        } else {
            student = modelVariable(student, studentModel.Student);
            const studentImageName = student.image;
            dal.deleteDocument(studentCollection, studentToDeleteId, (err, studentDeletedId) => {
                if (err) {
                    console.log('problem with deleting student');
                    cb('problem with deleting student');
                } else {
                    deleteUtils.deleteImageFromFolder(studentImageName, imgFolder, (err, isImgDeleted) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('student img deleted');
                        }
                    });
                    dal.get(courseCollection, (err, allCourses) => {
                        if (err) {
                            console.log('problem with getting courses list');
                        } else {
                            allCourses = modelVariable(allCourses, courseModel.Course);
                            let coursesToUpdate = [];
                            for (let i = 0; i < allCourses.length; i++) {
                                const singleCourseStudents = allCourses[i].courseStudents;
                                for (let j = 0; j < (singleCourseStudents).length; j++) {
                                    const studentId = singleCourseStudents[j];
                                    if (((studentId._id).toString()) === studentToDeleteId) {
                                        (singleCourseStudents).splice(j, 1);
                                        coursesToUpdate.push(allCourses[i]);
                                    }
                                }
                            }
                            coursesToUpdate.forEach((course) => {
                                dal.update(courseCollection, course, (err, courseUpdated) => {
                                    if (err) {
                                        console.log('problem with updating deletion of student from relevant courses');
                                    }
                                })
                            })
                        }
                    });
                    cb(null, studentDeletedId);
                }
            });
        }
    });
}

function modelVariable(toModel, modelType) {
    if (Array.isArray(toModel)) {
        toModel = toModel.map((element) => {
            return new modelType(element);
        });
        return toModel;
    } else {
        return new modelType(toModel);
    }
}

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
};