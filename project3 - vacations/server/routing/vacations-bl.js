const dal = require('../dal');
const vacationModel = require('../models/vacation-model')
const table = 'vacation';

function getVacations(callback) {
    dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
        allVacations = allVacations.map(element => {
            return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.fromDate, element.toDate, element.price, element.followers);
        });
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
        singleVacationData = singleVacationData.map(element => {
            return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.from_date, element.to_date, element.price, element.followers);
        });
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
    //1. change the from & to date from a type string to type date. 
    //2. make sure it's in the correct structure. for example: 2019-12-22
    vacationToADD = new vacationModel.Vacation(vacationToADD.id, vacationToADD.description, vacationToADD.destination, vacationToADD.image, vacationToADD.fromDate, vacationToADD.toDate, vacationToADD.price, vacationToADD.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = vacationToADD;
    dal.createOne(`insert into ${table} (id, description, destination, image, from_date, to_date, price, followers) values
     (${id}, '${description}', '${destination}', '${image}', ${fromDate}, ${toDate}, ${price}, ${followers})`, (e) => {
        if (e) {
            callback(e);
        } else {
            callback(null,'added');
        }
    })
}

function updateVacation(editedVacationData, callback) {
     //TODO: 
    //1. change the from & to date from a type string to type date. 
    //2. make sure it's in the correct structure. for example: 2019-12-22
    editedVacationData = new vacationModel.Vacation(editedVacationData.id, editedVacationData.description, editedVacationData.destination, editedVacationData.image, editedVacationData.fromDate, editedVacationData.toDate, editedVacationData.price, editedVacationData.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = editedVacationData
    dal.updateOne(`update ${table} set id=${id},description='${description}',destination='${destination}',image='${image}',from_date=${fromDate},to_date=${toDate},price=${price},followers=${followers} WHERE id = ${id};`, `SELECT * from ${table} where id=${id};`, (err, newUpdatedVacation) => {
        newUpdatedVacation = newUpdatedVacation.map(element => {
            return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.from_date, element.to_date, element.price, element.followers);
        });
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

module.exports = {
    getVacations: getVacations,
    getSingleVacation: getSingleVacation,
    createVacation: createVacation,
    updateVacation: updateVacation,
    deleteVacation: deleteVacation,
}