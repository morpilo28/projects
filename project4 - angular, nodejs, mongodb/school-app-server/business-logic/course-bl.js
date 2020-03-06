'use strict';

//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

const collection = 'course';
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

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
}