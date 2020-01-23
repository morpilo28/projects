"use strict";
const dal = require('../dal');
const vacationModel = require('../models/vacation-model');
const vacationTable = 'vacation';
const followTable = 'follow_vacation';

function getVacations(userId, callback, isForChart) {
    userId = Number(userId);
    let query = isForChart === 'true' ? `select * from ${vacationTable} where followers != 0` : `select * from ${vacationTable} order by id`;
    dal.readAll(query, (err, allVacations) => {
        allVacations = adjustVacationFormat(allVacations);
        if (err) {
            callback(err);
        } else {
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

function getSingleVacation(id, callback) {
    dal.readOne(`select * from ${vacationTable} where id = ${id}`, (err, singleVacationData) => {
        singleVacationData = adjustVacationFormat(singleVacationData);
        if (err) {
            callback(err);
        } else {
            //returns an obj
            callback(null, singleVacationData[0]);
        }
    })
}

function createVacation(vacationToADD, callback) {
    //TODO: make insert img possible
    vacationToADD.price = Number(vacationToADD.price);
    vacationToADD = new vacationModel.Vacation(null, vacationToADD.description, vacationToADD.destination, vacationToADD.image, vacationToADD.fromDate, vacationToADD.toDate, vacationToADD.price, vacationToADD.followers);
    const {description, destination, image, fromDate, toDate, price, followers} = vacationToADD;

    dal.readAll(`select * from ${vacationTable} order by id`, (err, allVacations) => {
        allVacations = adjustVacationFormat(allVacations);

        if (err) {
            callback(err);
        } else {
            let vacation = getVacationIfExists(allVacations, vacationToADD);
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
    let query = '';
    if (editedVacationData.destination) {
        //TODO: check why sometime invalid dates when updating followers
        editedVacationData.fromDate = setDate(new Date(editedVacationData.fromDate), true);
        editedVacationData.toDate = setDate(new Date(editedVacationData.toDate), true);
        editedVacationData = new vacationModel.Vacation(editedVacationData.id, editedVacationData.description, editedVacationData.destination, editedVacationData.image, editedVacationData.fromDate, editedVacationData.toDate, editedVacationData.price, editedVacationData.followers);
        const {id, description, destination, image, fromDate, toDate, price, followers} = editedVacationData;
        query = `update ${vacationTable} set id=${id},description='${description}',destination='${destination}',image='${image}',fromDate='${fromDate}',toDate='${toDate}',price=${price},followers=${followers} WHERE id = ${id};`;
    } else {
        if (editedVacationData.reduceOrAdd && editedVacationData.reduceOrAdd === 'add') {
            query = `UPDATE ${vacationTable} SET followers = followers+1 WHERE vacation.id = ${editedVacationData.id};`;
        } else if (editedVacationData.reduceOrAdd && editedVacationData.reduceOrAdd === 'reduce') {
            query = `UPDATE ${vacationTable} SET followers = followers-1 WHERE vacation.id = ${editedVacationData.id};`;
        } else {
            console.log(editedVacationData);
        }
    }

    dal.updateOne(query, (err) => {
        if (err) {
            callback(err);
        } else {
            getSingleVacation(editedVacationData.id, callback);
        }
    })
}

function deleteVacation(vacationId, userId, callback) {
    vacationId = Number(vacationId);
    userId = Number(userId);
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
                    }
                })
            }
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

function getVacationIfExists(allVacations, vacationToADD) {
    let fromDate = setDate(new Date(vacationToADD.fromDate));
    let toDate = setDate(new Date(vacationToADD.toDate));
    for (let i = 0; i < allVacations.length; i++) {
        const vacationsFromDb = allVacations[i];
        const newVacation = vacationToADD;
        if (vacationsFromDb.destination === newVacation.destination && vacationsFromDb.fromDate === fromDate && vacationsFromDb.toDate === toDate && vacationsFromDb.price === newVacation.price) {
            return vacationsFromDb;
        }
    }
    return false;
}

function adjustVacationFormat(vacations) {
    vacations = vacations.map(element => {
        element.fromDate = setDate(element.fromDate);
        element.toDate = setDate(element.toDate);
        return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.fromDate, element.toDate, element.price, element.followers);
    });
    return vacations;
}

module.exports = {
    getVacations: getVacations,
    getSingleVacation: getSingleVacation,
    createVacation: createVacation,
    updateVacation: updateVacation,
    deleteVacation: deleteVacation,
};