//TODO: make all strings to lower case;

const dal = require('../dal');
const vacationModel = require('../models/vacation-model')
const table = 'vacation';

function getVacations(callback) {
    dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
        allVacations = adjustVacationFormat(allVacations);
        if (err) {
            callback(err);
        } else {
            //returns an array of obj
            callback(null, allVacations);
        }
    })
}

function getSingleVacation(id, callback) {
    dal.readOne(`select * from ${table} where id = ${id}`, (err, singleVacationData) => {
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
    //TODO: 
    //1. make insert img possible
    vacationToADD.id = Number(vacationToADD.id);
    vacationToADD.price = Number(vacationToADD.price);
    vacationToADD = new vacationModel.Vacation(vacationToADD.id, vacationToADD.description, vacationToADD.destination, vacationToADD.image, vacationToADD.fromDate, vacationToADD.toDate, vacationToADD.price, vacationToADD.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = vacationToADD;

    dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
        allVacations = adjustVacationFormat(allVacations);

        if (err) {
            callback(err);
        } else {
            let isVacationAlreadyExist = isVacationExist(allVacations, vacationToADD);
            if (isVacationAlreadyExist) {
                callback(400);
            } else {
                dal.createOne(`insert into ${table} (id, description, destination, image, fromDate, toDate, price, followers) values
                    (${id}, '${description}', '${destination}', '${image}', '${fromDate}', '${toDate}', ${price}, ${followers})`, (e) => {
                    if (e) {
                        callback(e);
                    } else {
                        dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
                            allVacations = adjustVacationFormat(allVacations);
                            if (err) {
                                callback(err);
                            } else {
                                //returns an array of obj
                                callback(null, allVacations);
                            }
                        })
                    }
                })
            }

        }
    })
}

function updateVacation(editedVacationData, callback) {
    //TODO: check why sometime invalid dates when updating followers
    editedVacationData.fromDate = setDate(new Date(editedVacationData.fromDate), true);
    editedVacationData.toDate = setDate(new Date(editedVacationData.toDate), true);
    editedVacationData = new vacationModel.Vacation(editedVacationData.id, editedVacationData.description, editedVacationData.destination, editedVacationData.image, editedVacationData.fromDate, editedVacationData.toDate, editedVacationData.price, editedVacationData.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = editedVacationData
    dal.updateOne(`update ${table} set id=${id},description='${description}',destination='${destination}',image='${image}',fromDate='${fromDate}',toDate='${toDate}',price=${price},followers=${followers} WHERE id = ${id};`, `SELECT * from ${table} where id=${id};`, (err, newUpdatedVacation) => {
        newUpdatedVacation =  adjustVacationFormat(newUpdatedVacation);
        if (err) {
            callback(err);
        } else {
            callback(null, newUpdatedVacation[0].id);
        }
    })
}

function deleteVacation(id, callback) {
    dal.deleteOne(`delete from ${table} where id = ${id}`, (e) => {
        if (e) {
            callback(e);
        } else {
            callback(null);
        }
    })
}

function setDate(date, isFromUpdate) {
    let dateFormated;
    if (isFromUpdate) {
        dateFormated = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    } else {
        dateFormated = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
    }
    return dateFormated;
}

function isVacationExist(allVacations, vacationToADD) {
    let fromDate = setDate(new Date(vacationToADD.fromDate));
    let toDate = setDate(new Date(vacationToADD.toDate));
    for (let i = 0; i < allVacations.length; i++) {
        const a = allVacations[i];
        const b = vacationToADD;
        if (a.destination === b.destination && a.fromDate === fromDate && a.toDate === toDate && a.price === b.price) {
            return true;
        } else {
            isVacationAlreadyExist = false;
        }
    }
    return false;
}

function adjustVacationFormat(vacations) {
    vacations = vacations.map(element => {
        element.fromDate = setDate(new Date(element.fromDate));
        element.toDate = setDate(new Date(element.toDate));
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
}