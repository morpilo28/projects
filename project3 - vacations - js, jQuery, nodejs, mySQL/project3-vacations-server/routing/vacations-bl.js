"use strict";
const dal = require('../dal');
const vacationModel = require('../models/vacation-model');
const vacationTable = 'vacation';
const followTable = 'follow_vacation';
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');

function getVacations(userId, callback, isForChart) {
    userId = Number(userId);
    let queryToGetArrayForChart = `select * from ${vacationTable} where followers != 0`;
    let queryToGetVacationsList = `select * from ${vacationTable} order by id`;
    let query = (isForChart === 'true') ? queryToGetArrayForChart : queryToGetVacationsList;
    dal.readAll(query, (err, allVacations) => {
        if (err) {
            callback(err);
        } else {
            let expiredVacations = getExpiredVacations(allVacations);
            for (let i = 0; i < expiredVacations.length; i++) {
                deleteExpiredVacationsFromAllVacationsArray(allVacations, expiredVacations, i);
                deleteExpiredVacationFromDb(expiredVacations[i].id, userId, callback);
            }
            allVacations = adjustVacationFormat(allVacations);
            if (isForChart === 'true') {
                callback(null, allVacations);
            } else {
                dal.readAll(`select vacation_id from ${followTable} where user_id = ${userId} `, (err, userFollowedVacations) => {
                    if (err) {
                        callback(err);
                    } else {
                        let userFollowedVacationsIds = createArrayOfFollowedVacationsId(userFollowedVacations);
                        let organizedVacationArray = addFollowedVacationToOrganizedArray(allVacations, userFollowedVacationsIds);
                        organizedVacationArray = addUnFollowedVacationsToOrganizedArray(allVacations, organizedVacationArray);

                        const data = {
                            organizedVacationArray: organizedVacationArray,
                            userFollowedVacationsIds: userFollowedVacationsIds
                        };
                        callback(null, data);
                    }
                });
            }
        }
    });
}

function createVacation(vacationToADD, callback) {
    vacationToADD.price = Number(vacationToADD.price);
    vacationToADD = new vacationModel.Vacation(null, vacationToADD.description, vacationToADD.destination, vacationToADD.image, vacationToADD.fromDate, vacationToADD.toDate, vacationToADD.price, vacationToADD.followers);
    const {description, destination, image, fromDate, toDate, price, followers} = vacationToADD;

    dal.readAll(`select * from ${vacationTable} order by id`, (err, allVacations) => {
        allVacations = adjustVacationFormat(allVacations);
        if (err) {
            callback(err);
        } else {
            let vacation = getVacationIfExists(allVacations, vacationToADD, true);
            if (vacation) {
                callback(400);
            } else {
                dal.createOne(`insert into ${vacationTable} (description, destination, image, fromDate, toDate, price, followers) values
                    ('${description}', '${destination}', '${image}', '${fromDate}', '${toDate}', ${price}, ${followers})`, `select * from ${vacationTable} order by id`, (e, allVacations) => {
                    if (e) {
                        callback(e);
                    } else {
                        allVacations = adjustVacationFormat(allVacations);
                        let createdVacation = getVacationIfExists(allVacations, vacationToADD);
                        callback(null, createdVacation);
                    }
                })
            }
        }
    })
}

function updateVacation(editedVacationData, callback) {
    editedVacationData.id = Number(editedVacationData.id);
    editedVacationData.price = Number(editedVacationData.price);
    editedVacationData.followers = Number(editedVacationData.followers);
    let query = '';
    let wasImageAdded = !!editedVacationData.imageWasAdded;
    console.log(wasImageAdded);
    let originalObjToEdit = editedVacationData.originalObjToEdit ? editedVacationData.originalObjToEdit : null;
    if (originalObjToEdit) {
        let originalObjToEdit = editedVacationData.originalObjToEdit;
        originalObjToEdit.price = Number(originalObjToEdit.price);
        originalObjToEdit = new vacationModel.Vacation(originalObjToEdit.id, originalObjToEdit.description, originalObjToEdit.destination, originalObjToEdit.image, originalObjToEdit.fromDate, originalObjToEdit.toDate, originalObjToEdit.price, originalObjToEdit.followers);
    }
    if (editedVacationData.destination) {
        editedVacationData.fromDate = setDate(new Date(editedVacationData.fromDate), true);
        editedVacationData.toDate = setDate(new Date(editedVacationData.toDate), true);
        editedVacationData = new vacationModel.Vacation(editedVacationData.id, editedVacationData.description, editedVacationData.destination, editedVacationData.image, editedVacationData.fromDate, editedVacationData.toDate, editedVacationData.price, editedVacationData.followers);
        const {id, description, destination, image, fromDate, toDate, price, followers} = editedVacationData;
        query = `update ${vacationTable} set id=${id},description='${description}',destination='${destination}',image='${image}',fromDate='${fromDate}',toDate='${toDate}',price=${price},followers=${followers} WHERE id = ${id};`;
        dal.readAll(`select * from ${vacationTable} order by id`, (err, allVacations) => {
            allVacations = adjustVacationFormat(allVacations);
            if (err) {
                callback(err);
            } else {
                let vacation = getVacationIfExists(allVacations, editedVacationData, wasImageAdded, originalObjToEdit);
                if (vacation) {
                    callback(400);
                } else {
                    dalUpdateVacation(query, callback, editedVacationData);
                }
            }
        })
    } else {
        if (editedVacationData.reduceOrAdd && editedVacationData.reduceOrAdd === 'add') {
            query = `UPDATE ${vacationTable} SET followers = followers+1 WHERE vacation.id = ${editedVacationData.id};`;
        } else if (editedVacationData.reduceOrAdd && editedVacationData.reduceOrAdd === 'reduce') {
            query = `UPDATE ${vacationTable} SET followers = followers-1 WHERE vacation.id = ${editedVacationData.id};`;
        }

        dalUpdateVacation(query, callback, editedVacationData)
    }
}

function deleteVacation(vacationId, userId, imageName, callback) {
    vacationId = Number(vacationId);
    dal.readAll(`select * from ${followTable} where vacation_id = ${vacationId};`, (e, data) => {
        if (e) {
            callback(e);
        } else {
            if (data.length !== 0) {
                dal.deleteOne(`delete from ${followTable} where vacation_id = ${vacationId}`, (e) => {
                    if (e) {
                        console.log(e);
                        callback(e);
                    } else {
                        dal.deleteOne(`delete from ${vacationTable} where id = ${vacationId}`, (e) => {
                            if (e) {
                                console.log(e);
                                callback(e);
                            } else {
                                callback(null);
                                deleteImageFromFolder(imageName);
                            }
                        })
                    }
                })
            } else {
                dal.deleteOne(`delete from ${vacationTable} where id = ${vacationId}`, (e) => {
                    if (e) {
                        console.log(e);
                        callback(e);
                    } else {
                        callback(null);
                        deleteImageFromFolder(imageName);
                    }
                })
            }
        }
    })
}

function getExpiredVacations(allVacations) {
    let expiredVacations = [];
    let today = new Date().setHours(0, 0, 0, 0);
    allVacations.forEach(vacation => {
        let vacationToDate = vacation.toDate.setHours(0, 0, 0, 0);
        if (vacationToDate < today) {
            expiredVacations.push(vacation);
        }
    });
    return expiredVacations;
}

function deleteExpiredVacationsFromAllVacationsArray(allVacations, expiredVacations, i) {
    let expiredVacationIndex = allVacations.map((vacation) => vacation.id).indexOf(expiredVacations[i].id);
    allVacations.splice(expiredVacationIndex, 1);
}

function deleteExpiredVacationFromDb(expiredVacationId, userId, callback) {
    deleteVacation(expiredVacationId, userId, (err) => {
        if (err) {
            callback(err);
        } else {
            console.log('deleted');
        }
    });
}

function dalUpdateVacation(query, callback, editedVacationData) {
    dal.updateOne(query, (err) => {
        if (err) {
            callback(500);
        } else {
            getSingleVacation(editedVacationData.id, callback);
        }
    });
}

function getSingleVacation(id, callback) {
    dal.readOne(`select * from ${vacationTable} where id = ${id}`, (err, singleVacationData) => {
        singleVacationData = adjustVacationFormat(singleVacationData);
        if (err) {
            callback(err);
        } else {
            callback(null, singleVacationData[0]);
        }
    })
}

function addUnFollowedVacationsToOrganizedArray(allVacations, organizedArray) {
    let newArry = [...organizedArray];
    let vacationIdAlreadyExist = false;
    for (let i = 0; i < allVacations.length; i++) {
        for (let j = 0; j < newArry.length; j++) {
            vacationIdAlreadyExist = false;
            if (newArry[j].id === allVacations[i].id) {
                vacationIdAlreadyExist = true;
                break;
            }
        }
        if (vacationIdAlreadyExist === false) {
            organizedArray.push(allVacations[i]);
        }
    }
    return organizedArray;
}

function addFollowedVacationToOrganizedArray(allVacations, userFollowedVacationsIds) {
    let organizedArray = [];
    for (let i = 0; i < allVacations.length; i++) {
        for (let j = 0; j < userFollowedVacationsIds.length; j++) {
            if (userFollowedVacationsIds[j] === allVacations[i].id) {
                organizedArray.push(allVacations[i]);
            }
        }
    }
    return organizedArray;
}

function createArrayOfFollowedVacationsId(userFollowedVacations) {
    let userFollowedVacationsIds = [];
    for (let i = 0; i < userFollowedVacations.length; i++) {
        let followedVacationIdToArray = Object.values(userFollowedVacations[i]);
        userFollowedVacationsIds.push(followedVacationIdToArray[0]);
    }
    return userFollowedVacationsIds;
}

function setDate(date, isFromUpdate) {
    let dateFormatted;
    if (isFromUpdate) {
        dateFormatted = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    } else {
        dateFormatted = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
    }
    return dateFormatted;
}

function getVacationIfExists(allVacations, vacationToADD, isImageAdded, originalObjToEdit) {
    let fromDate = setDate(new Date(vacationToADD.fromDate));
    let toDate = setDate(new Date(vacationToADD.toDate));
    if (originalObjToEdit) {
        let originalDestination = strToLowerCase(originalObjToEdit.destination);
        let destinationToAdd = strToLowerCase(vacationToADD.destination);
        if (originalDestination === destinationToAdd && originalObjToEdit.fromDate === fromDate && originalObjToEdit.toDate === toDate && originalObjToEdit.price === vacationToADD.price) {
            console.log('original vacation');
            return false;
        } else {
            console.log('not original vacation');
            return isVacationAlreadyExists(allVacations, fromDate, toDate, vacationToADD, isImageAdded);
        }
    } else {
        return isVacationAlreadyExists(allVacations, fromDate, toDate, vacationToADD, isImageAdded);
    }
}

function isVacationAlreadyExists(allVacations, fromDate, toDate, vacationToADD, isImageAdded) {
    for (let i = 0; i < allVacations.length; i++) {
        const vacationsFromDb = allVacations[i];
        let destinationFromDb = strToLowerCase(vacationsFromDb.destination);
        let destinationToAdd = strToLowerCase(vacationToADD.destination);
        if (destinationFromDb === destinationToAdd && vacationsFromDb.fromDate === fromDate && vacationsFromDb.toDate === toDate && vacationsFromDb.price === vacationToADD.price) {
            if (isImageAdded) {
                deleteImageFromFolder(vacationToADD.image);
                return vacationsFromDb;
            } else {
                return vacationsFromDb;
            }
        }
    }
    return false;
}

function deleteImageFromFolder(imageName) {
    let ImageToDelete = (`${path}/images/${imageName}`);
    fs.unlink(ImageToDelete, (e) => {
        console.log(ImageToDelete);
        if (e) {
            console.log(e);
        } else {
            console.log('image deleted from folder');
        }
    });
}

function adjustVacationFormat(vacations) {
    vacations = vacations.map(element => {
        element.fromDate = setDate(element.fromDate);
        element.toDate = setDate(element.toDate);
        return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.fromDate, element.toDate, element.price, element.followers);
    });
    return vacations;
}

function strToLowerCase(str) {
    str = str.toLowerCase();
    return str;
}

module.exports = {
    getVacations: getVacations,
    createVacation: createVacation,
    updateVacation: updateVacation,
    deleteVacation: deleteVacation,
};
