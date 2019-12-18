const dal = require('../dal');
const table = 'user';
const userModel = require('../models/user-model');

function isUserNameAlreadyExist(registeredUser, callback) {
    //checking if a userName already exist in the db
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
    userToAdd = new userModel.User(userToAdd.id, userToAdd.firstName, userToAdd.lastName, userToAdd.userName, userToAdd.password, userToAdd.isAdmin);
    const { id, firstName, lastName, userName, password, isAdmin } = userToAdd;
    dal.createOne(`insert into ${table} (id, first_name, last_name, user_name, password, is_admin) values (${id},'${firstName}','${lastName}','${userName}', '${password}', '${isAdmin}');`, (e) => {
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

function createUserTypeObj(allUsers){
    allUsers = allUsers.map(element => {
        return new userModel.User(element.id, element.first_name, element.last_name, element.user_name, element.password, element.is_admin);
    });
    return allUsers;
}

module.exports = {
    registerUser: registerUser,
    validateUser: validateUser,
    isUserNameAlreadyExist: isUserNameAlreadyExist
}