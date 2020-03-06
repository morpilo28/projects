//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

"use strict";
const ObjectId = require('mongodb').ObjectId;
const collection = 'administrator';
const dal = require('../dal');

function get(cb) {
    dal.get(collection, (e, allUsers) => {
        if (e) {
            cb("can't get user's list");
        } else {
            allUsers.map((usrObj) => {
                delete usrObj['password'];
            });
            cb(null, allUsers);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(collection, id, (e, user) => {
        if (e) {
            cb("can't get user");
        } else {
            if (user) {
                delete user['password'];
            }
            cb(null, user);
        }
    })
}

function isUserExist(userToValidate, cb) {
    dal.get(collection, (e, allUsers) => {
        if (e) {
            cb("can't get user's list");
        } else {
            let singleUser = allUsers.filter((obj) => obj.name === userToValidate.name && obj.password === userToValidate.password);
            if (singleUser.length === 0) {
                cb('no user has been found');
            } else if (singleUser.length > 1) {
                console.log('there is more than one user under the same name');
            } else {
                cb(null, singleUser[0]);
            }
        }
    });
}

function insertOne(userToAdd, cb) {
    dal.insert(collection, userToAdd, (e, userInserted) => {
        if (e) {
            cb("can't insert user");
        } else {
            cb(null, userInserted);
        }
    })
}

//TODO: check if works;
function updateOne(userToUpdate, cb) {
    dal.update(collection, userToUpdate, (e, userUpdated) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, userToUpdate);
        }
    });
}

//TODO: check if works;
function deleteOne(userToDeleteId, cb) {
    dal.deleteDocument(collection, userToDeleteId, (e, userDeletedId) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, userDeletedId);
        }
    });
}

module.exports = {
    isUserExist: isUserExist,
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
};