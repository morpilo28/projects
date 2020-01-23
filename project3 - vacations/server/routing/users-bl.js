//TODO: make all strings to lower case;

const dal = require('../dal');
const table = 'user';
const userModel = require('../models/user-model');
const followTable = 'follow_vacation';
const followModel = require('../models/follow-model');

function isUserNameAlreadyExist(registeredUser, callback) {
    //checking if a userName already exist in the db
    registeredUser = new userModel.User(null, registeredUser.firstName, registeredUser.lastName, registeredUser.userName, registeredUser.password, registeredUser.isAdmin);
    dal.readAll(`select * from ${table} `, (e, allUsers) => {
        allUsers = createUserTypeObj(allUsers);
        if (e) {
            callback(e);
        } else {
            let singleObj = allUsers.filter((obj) => obj.userName === registeredUser.userName);
            if (singleObj.length > 0) {
                callback('user name taken.');
            } else {
                callback(null);
            }
        }
    })
}

function registerUser(userToAdd, callback) {
    userToAdd = new userModel.User(null, userToAdd.firstName, userToAdd.lastName, userToAdd.userName, userToAdd.password, userToAdd.isAdmin);
    const {firstName, lastName, userName, password, isAdmin} = userToAdd;
    dal.createOne(`insert into ${table} (first_name, last_name, user_name, password, is_admin) values ('${firstName}','${lastName}','${userName}', '${password}', '${isAdmin}');`, `select * from ${table} where user_name like '${userName}'`, (e, data) => {
        if (e) {
            callback(e);
        } else {
            callback(null);
        }
    })
}

function validateUser(userToValidate, callback) {
    //checking if a user exist in the db
    dal.readAll(`select * from ${table}`, (e, allUsers) => {
        allUsers = createUserTypeObj(allUsers);
        if (e) {
            callback(e);
        } else {
            let singleObj = allUsers.filter((obj) => obj.userName === userToValidate.userName && obj.password === userToValidate.password);
            if (singleObj.length === 0) {
                callback('no user has been found');
            } else if (singleObj.length > 1) {
                console.log('there is more than one user under the same name');
            } else {
                callback(null, singleObj[0]);
            }
        }
    })
}

function createUserTypeObj(allUsers) {
    allUsers = allUsers.map(element => {
        return new userModel.User(element.id, element.first_name, element.last_name, element.user_name, element.password, element.is_admin);
    });
    return allUsers;
}

function checkIfFollowed(followObjToAdd, callback) {
    followObjToAdd = modalFollowObj(followObjToAdd);
    dal.readAll(`select * from ${followTable} where vacation_id = ${followObjToAdd.vacationId} && user_id = ${followObjToAdd.userId};`, (e, data) => {
        if (data.length !== 0) {
            dal.deleteOne(`delete from ${followTable} where user_id = ${followObjToAdd.userId} and vacation_id = ${followObjToAdd.vacationId}`, (e) => {
                if (e) {
                    callback('problem with deleting');
                } else {
                    const data = {
                        isFollowed: false,
                        vacationId: followObjToAdd.vacationId
                    }
                    callback(null, data);
                }
            })
        } else {
            dal.createOne(`insert into ${followTable} (user_id, vacation_id) values (${followObjToAdd.userId}, ${followObjToAdd.vacationId});`, `select * from ${followTable};`, (e, allFollowedVacation) => {
                if (e) {
                    callback(e);
                } else {
                    const data = {
                        isFollowed: true,
                        vacationId: followObjToAdd.vacationId
                    }
                    callback(null, data);
                }
            })
        }
    })
}

function modalFollowObj(followObjToAdd) {
    followObjToAdd.userId = Number(followObjToAdd.userId);
    followObjToAdd.vacationId = Number(followObjToAdd.vacationId);
    followObjToAdd = new followModel.Follow(followObjToAdd.userId, followObjToAdd.vacationId);
    return followObjToAdd;
}

module.exports = {
    registerUser: registerUser,
    validateUser: validateUser,
    isUserNameAlreadyExist: isUserNameAlreadyExist,
    checkIfFollowed: checkIfFollowed,
}