"use strict";
const collection = 'administrator';
const dal = require('../dal');
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');
const imgFolder = 'userImages';
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

function get(cb) {
    dal.get(collection, (e, allUsers) => {
        if (e) {
            cb("can't get user's list");
        } else {
            allUsers = modelVariable(allUsers, userModel.User);
            allUsers.map((userObj) => {
                delete userObj['password'];
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
                user = modelVariable(user, userModel.User);
                delete user['password'];
                cb(null, user);
            } else {
                cb('no user has been found');
            }
        }
    })
}

function isUserExist(userToValidate, cb) {
    dal.get(collection, (e, allUsers) => {
        if (e) {
            cb("can't get user's list");
        } else {
            allUsers = modelVariable(allUsers, userModel.User);
            let singleUser = allUsers.filter((obj) => obj.email === userToValidate.email && obj.password === userToValidate.password);
            if (singleUser.length === 0) {
                cb('no user has been found');
            } else if (singleUser.length > 1) {
                console.log('there is more than one user under the same name');
            } else {
                const token = getToken(userToValidate);
                deleteObjProp(singleUser[0], 'password');
                deleteObjProp(singleUser[0], 'phone');
                deleteObjProp(singleUser[0], 'email');
                singleUser[0]['token'] = token;
                cb(null, singleUser[0]);
            }
        }
    });
}

function insertOne(userToAdd, cb) {
    dal.insert(collection, userToAdd, (e, userInserted) => {
        userInserted = modelVariable(userInserted, userModel.User);
        if (e) {
            cb("can't insert user");
        } else {
            deleteObjProp(userInserted, 'password');
            cb(null, userInserted);
        }
    })
}

function updateOne(userToUpdate, cb) {
    dal.update(collection, userToUpdate, (e, userUpdated) => {
        userUpdated = modelVariable(userUpdated, userModel.User);
        delete userUpdated['password'];
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, userUpdated);
        }
    });
}

function deleteOne(userToDeleteId, cb) {
    dal.getOne(collection, userToDeleteId, (e, user) => {
        if (e) {
            console.log("can't get user");
        } else {
            user = modelVariable(user, userModel.User);
            const userImageName = user.image;
            dal.deleteDocument(collection, userToDeleteId, (e, userDeletedId) => {
                if (e) {
                    console.log(e);
                    cb(e);
                } else {
                    //TODO: maybe make it sync func or put cb after deleting image
                    console.log(userDeletedId);
                    deleteImageFromFolder(userImageName);
                    cb(null, userDeletedId);
                }
            });
        }
    })
}

function deleteObjProp(obj, key) {
    delete obj[key];
}

function deleteImageFromFolder(imageName) {
    let ImageToDelete = (`${path}/images/${imgFolder}/${imageName}`);
    fs.unlink(ImageToDelete, (e) => {
        if (e) {
            console.log('problem with deleting image');
        }
    });
}

function getToken(userToValidate) {
    return jwt.sign({
        userEmail: userToValidate.email
    }, SECRET_KEY_FOR_JWT, {
        expiresIn: '365d'
    });
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
    isUserExist: isUserExist,
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
    deleteImageFromFolder: deleteImageFromFolder,
};