'use strict';

//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

const collection = 'course';
const studentCollection = 'student';
const dal = require('../dal');

function get(cb) {
    dal.get(collection, (e, allCourses) => {
        if (e) {
            cb(e);
        } else {
            cb(null, allCourses);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(collection, id, (e, course) => {
        if (e) {
            cb("can't get course")
        } else {
            cb(null, course);
        }
    });
}

function insertOne(courseToAdd, cb) {
    dal.insert(collection, courseToAdd, (e, courseInserted) => {
        if (e) {
            cb("can't insert course")
        } else {
            cb(null, courseInserted);
        }
    })
}

//TODO: check if works;
function updateOne(courseNewData, cb) {
    dal.update(collection, courseNewData, (e, courseUpdated) => {
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
                        //TODO: iterate through studentCourses and find the course that needs to be updated
                        // change it and then update the whole student document
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
            else {
                console.log('course updated');
            }
        });
    }
}

//TODO: check if works;
function deleteOne(courseToDeleteId, cb) {
    dal.deleteDocument(collection, courseToDeleteId, (e, courseDeletedId) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, courseDeletedId);
        }
    });
}

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
}