'use strict';
const courseCollection = 'course';
const studentCollection = 'student';
const dal = require('../dal');
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');
const imgFolder = 'courseImages';

function get(cb) {
    dal.get(courseCollection, (e, allCourses) => {
        if (e) {
            cb(e);
        } else {
            cb(null, allCourses);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(courseCollection, id, (e, course) => {
        if (e) {
            cb("can't get course")
        } else {
            cb(null, course);
        }
    });
}

function insertOne(courseToAdd, cb) {
    dal.insert(courseCollection, courseToAdd, (e, courseInserted) => {
        if (e) {
            cb("can't insert course")
        } else {
            cb(null, courseInserted);
        }
    })
}

function updateOne(courseNewData, cb) {
    dal.update(courseCollection, courseNewData, (e, courseUpdated) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            const studentsToUpdate = courseNewData.courseStudents;
            delete courseUpdated['courseStudents'];
            studentsToUpdate.forEach(student => {
                dal.getOne(studentCollection, student._id, (e, student) => {
                    if (e) {
                        console.log("can't get student");
                    }
                    else {
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
        dal.update(studentCollection, student, (e, data) => {
            if (e) {
                console.log('problem with updating the course');
            }
        });
    }
}

function deleteOne(courseToDeleteId, cb) {
    dal.getOne(courseCollection, courseToDeleteId, (e, course) => {
        if (e) {
            console.log("can't get course");
        } else {
            const courseImageName = course.image;
            dal.deleteDocument(courseCollection, courseToDeleteId, (e, courseDeletedId) => {
                if (e) {
                    console.log(e);
                    cb(e);
                } else {
                    //TODO: maybe make it sync func or put cb after deleting image
                    deleteImageFromFolder(courseImageName);
                    cb(null, courseDeletedId);
                }
            });
        }
    })
}

function deleteImageFromFolder(imageName) {
    let ImageToDelete = (`${path}/images/${imgFolder}/${imageName}`);
    fs.unlink(ImageToDelete, (e) => {
        if (e) {
            console.log('problem with deleting image');
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