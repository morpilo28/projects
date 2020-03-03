//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

"use strict";
const ObjectId = require('mongodb').ObjectId;
const usersCollection = 'administrator';
const dal = require('../dal');

function get(cb) {
    dal.get(usersCollection).then(data => {
        const allUsers = data;
            cb(null, allUsers);
    }).catch(e => cb("can't get user's list"));
}

function isUserExist(userToValidate, cb) {
    dal.get(usersCollection).then(data => {
        const allUsers = data;
        let singleUser = allUsers.filter((obj) => obj.name === userToValidate.name && obj.password === userToValidate.password);
        if (singleUser.length === 0) {
            cb('no user has been found');
        } else if (singleUser.length > 1) {
            console.log('there is more than one user under the same name');
        } else {
            cb(null, singleUser[0]);
        }
    }).catch(e => console.log("can't get user's list"));
}


function getUser(user, cb) {
    //getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
    /*     const filterByKeys = [];
        if(user.id){
            user.id = new ObjectId(user.id); //TODO: takes the string and make it to an ObjectId; needs to happend in the BL?!
            filterByKeys = ['_id'];
        }else{
            filterByKeys = ['name', 'password'];
        } 

    filterByKeys = ['name', 'password'];
    dal.getOne(usersCollection, filterByKeys, user); 
    */
}

module.exports = {
    isUserExist: isUserExist,
    get:get,
};