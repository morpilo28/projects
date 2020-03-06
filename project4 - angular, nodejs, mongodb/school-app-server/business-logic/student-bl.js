'use strict';

//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

const studentCollection = 'student';
const courseCollection = 'course';
const dal = require('../dal');

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
            console.log(studentToAddToCourse);
            for (let i = 0; i < studentToAdd.courses.length; i++) {
                if (studentToAdd.courses[i].isChecked) {
                    dal.pushToArray(courseCollection, studentToAdd.courses[i]._id, studentToAddToCourse, (e, singleCourse) => {
                        if (e) {
                            cb("can't insert student into his checked courses");
                        } else {
                            console.log('check');
                            console.log(singleCourse);
                            cb(null, studentInserted);
                        }
                    });
                }
            }
        }
    });
}

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
}