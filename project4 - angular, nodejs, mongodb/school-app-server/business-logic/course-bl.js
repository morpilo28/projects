'use strict';
const courseCollection = 'course';
const studentCollection = 'student';
const dal = require('../dal');
const imgFolder = 'courseImages';
const deleteUtils = require('../utils/deleteImage');
const studentModel = require('../models/student-model');
const courseModel = require('../models/course-model');

function get(cb) {
    dal.get(courseCollection, (err, allCourses) => {
        if (err) {
            cb(err);
        } else {
            allCourses = modelVariable(allCourses, courseModel.Course);
            cb(null, allCourses);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(courseCollection, id, (err, course) => {
        if (err) {
            cb("can't get course")
        } else {
            course = modelVariable(course, courseModel.Course);
            cb(null, course);
        }
    });
}

function insertOne(courseToAdd, cb) {
    courseToAdd = modelVariable(courseToAdd, courseModel.Course);
    dal.insert(courseCollection, courseToAdd, (err, courseInserted) => {
        if (err) {
            cb("can't insert course")
        } else {
            courseInserted = modelVariable(courseInserted, courseModel.Course);
            cb(null, courseInserted);
        }
    })
}

function updateOne(courseNewData, cb) {
    courseNewData = modelVariable(courseNewData, courseModel.Course);
    dal.update(courseCollection, courseNewData, (err, courseUpdated) => {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            courseUpdated = modelVariable(courseUpdated, courseModel.Course);
            const studentsToUpdate = courseNewData.courseStudents;
            delete courseUpdated['courseStudents'];
            studentsToUpdate.forEach(student => {
                dal.getOne(studentCollection, student._id, (err, student) => {
                    if (err) {
                        console.log("can't get student");
                    }
                    else {
                        student = modelVariable(student, studentModel.Student);
                        if (student) {
                            let studentCourses = student.courses;
                            const foundIndex = studentCourses.findIndex(course => course._id.toString() === courseNewData._id.toString());
                            studentCourses[foundIndex] = courseUpdated;
                            updateStudent(student);
                        }
                    }
                });
            });
            cb(null, courseNewData);
        }
    });
    function updateStudent(student) {
        dal.update(studentCollection, student, (err, updatedStudent) => {
            if (err) {
                console.log('problem with updating the course');
            }
        });
    }
}

function deleteOne(courseToDeleteId, cb) {
    dal.getOne(courseCollection, courseToDeleteId, (err, course) => {
        course = modelVariable(course, courseModel.Course);
        if (err) {
            console.log("can't get course");
        } else {
            const courseImageName = course.image;
            dal.deleteDocument(courseCollection, courseToDeleteId, (err, courseDeletedId) => {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    deleteUtils.deleteImageFromFolder(courseImageName, imgFolder, (err, isImgDeleted) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('course img deleted');
                        }
                     });
                    cb(null, courseDeletedId);
                }
            });
        }
    })
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