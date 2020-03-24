'use strict';

const studentCollection = 'student';
const courseCollection = 'course';
const dal = require('../dal');
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');
const imgFolder = 'studentImages';

function get(cb) {
    dal.get(studentCollection, (e, d) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, d);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(studentCollection, id, (e, student) => {
        if (e) {
            console.log("can't get student");
        } else {
            cb(null, student);
        }
    });
}

function insertOne(studentToAdd, cb) {
    dal.insert(studentCollection, studentToAdd, (e, studentInserted) => {
        if (e) {
            console.log("can't insert student");
        } else {
            const studentToAddToCourse = { ...studentToAdd };
            delete studentToAddToCourse['courses'];
            for (let i = 0; i < studentToAdd.courses.length; i++) {
                dal.pushToArray(courseCollection, studentToAdd.courses[i]._id, studentToAddToCourse, (e, singleCourse) => {
                    if (e) {
                        cb("can't insert student into his checked courses");
                    } else {
                        console.log('inserter student into checked course');
                    }
                });
            }
            cb(null, studentInserted);
        }
    });
}

function updateOne(studentData, cb) {
    const studentNewData = studentData.new;
    const studentOldData = studentData.old;
    dal.update(studentCollection, studentNewData, (e, studentUpdated) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            console.log('------------------');
            console.log(studentUpdated);
            const coursesToUpdate = getCoursesToUpdate(studentData);
            delete studentNewData['courses'];

            coursesToUpdate.forEach((course) => {
                updateCourses(course, studentNewData);
            })
            cb(null, studentUpdated);
        }
    });

    function updateCourses(course, studentToAddToCourse) {
        dal.getOne(courseCollection, course._id, (e, d) => {
            let courseStudents = d.courseStudents;
            if (e) {
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
                        updateCourse(d);
                    } else {
                        updateCourse(d);
                    }
                }
                else if (course.action === 'remove') {
                    //maybe use find func
                    courseStudents = courseStudents.map((student, i) => {
                        if (studentNewData._id.toString() === student._id.toString()) {
                            courseStudents.splice(i, 1);
                        }
                        updateCourse(d);
                    });
                }
            }
        });
    }

    function getCoursesToUpdate(studentData) {
        //TODO: take the new and old arrays
        //TODO: check if which courses among them were added and which was remove
        //TODO: create a new array of 2 keys: id, action (add/remove).

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
            console.log(isTheSameCourse);
            if (!isTheSameCourse) {
                course['action'] = 'remove';
                coursesToUpdate.push(course);
            }
        });

        return coursesToUpdate
    }

    function updateCourse(d) {
        dal.update(courseCollection, d, (e, data) => {
            if (e) {
                console.log('problem with updating the course');
            }
            else {
                console.log('course updated');
            }
        });
    }
}

function deleteOne(studentToDeleteId, cb) {
    dal.getOne(studentCollection, studentToDeleteId, (e, student) => {
        if (e) {
            console.log("can't get student");
        } else {
            const studentImageName = student.image;
            dal.deleteDocument(studentCollection, studentToDeleteId, (e, studentDeletedId) => {
                if (e) {
                    console.log('problem with deleting student');
                    cb('problem with deleting student');
                } else {
                    deleteImageFromFolder(studentImageName);
                    dal.get(courseCollection, (e, allCourses) => {
                        if (e) {
                            console.log('problem with getting courses list');
                        } else {
                            let coursesToUpdate = [];
                            for (let i = 0; i < allCourses.length; i++) {
                                const singleCourseStudents = allCourses[i].courseStudents;
                                for (let j = 0; j < (singleCourseStudents).length; j++) {
                                    const studentId = singleCourseStudents[j]
                                    if (((studentId._id).toString()) === studentToDeleteId) {
                                        (singleCourseStudents).splice(j, 1);
                                        coursesToUpdate.push(allCourses[i]);
                                    }
                                }
                            }
                            coursesToUpdate.forEach((course) => {
                                dal.update(courseCollection, course, (e, d) => {
                                    if (e) {
                                        console.log('problem with updating deletion of student from relevant courses');
                                    } else {
                                        console.log('courses that students where deleted from were updated');
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

function deleteImageFromFolder(imageName) {
    let ImageToDelete = (`${path}/images/${imgFolder}/${imageName}`);
    fs.unlink(ImageToDelete, (e) => {
        if (e) {
            console.log(e);
        } else {
            console.log('image deleted from folder');
        }
    });
}

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
    deleteImageFromFolder: deleteImageFromFolder,
}