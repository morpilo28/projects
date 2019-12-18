const dal = require('../dal');
const vacationModel = require('../models/vacation-model')
const table = 'vacation';

function getVacations(callback) {
    dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
        allVacations = allVacations.map(element => {
            element.from_date = setDate(new Date(element.from_date));
            element.to_date = setDate(new Date(element.to_date));
            return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.from_date, element.to_date, element.price, element.followers);
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
    //1. check if vacation already exist. if so, send note to admin. if not, add vacation.
    //2. make insert img possible
    vacationToADD.id = Number(vacationToADD.id);
    vacationToADD.price = Number(vacationToADD.price);
    vacationToADD.fromDate = setDate(new Date(vacationToADD.fromDate));
    vacationToADD.toDate = setDate(new Date(vacationToADD.toDate));
    vacationToADD = new vacationModel.Vacation(vacationToADD.id, vacationToADD.description, vacationToADD.destination, vacationToADD.image, vacationToADD.fromDate, vacationToADD.toDate, vacationToADD.price, vacationToADD.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = vacationToADD;
    dal.readAll(`select * from ${table} order by id`, (err, allVacations) => {
        allVacations = allVacations.map(element => {
            element.from_date = setDate(element.from_date);
            element.to_date = setDate(element.to_date);
            return new vacationModel.Vacation(element.id, element.description, element.destination, element.image, element.from_date, element.to_date, element.price, element.followers);
        });
        if (err) {
            callback(err);
        } else {
            let isVacationAlreadyExist = false;
            for (let i = 0; i < allVacations.length; i++) {
                const a = allVacations[i];
                const b = vacationToADD;
                if (a.destination === b.destination && a.fromDate === b.fromDate && a.toDate === b.toDate && a.price === b.price) {
                    isVacationAlreadyExist = true;
                    break;
                } else {
                    isVacationAlreadyExist = false;
                }
            }
            if (isVacationAlreadyExist) {
                callback(400);
            } else {
                dal.createOne(`insert into ${table} (id, description, destination, image, from_date, to_date, price, followers) values
                    (${id}, '${description}', '${destination}', '${image}', '${fromDate}', '${toDate}', ${price}, ${followers})`, (e) => {
                    if (e) {
                        callback(e);
                    } else {
                        callback(null, allVacations);
                    }
                })
            }

        }
    })
}

function updateVacation(editedVacationData, callback) {
    editedVacationData = new vacationModel.Vacation(editedVacationData.id, editedVacationData.description, editedVacationData.destination, editedVacationData.image, editedVacationData.fromDate, editedVacationData.toDate, editedVacationData.price, editedVacationData.followers);
    const { id, description, destination, image, fromDate, toDate, price, followers } = editedVacationData
    dal.updateOne(`update ${table} set id=${id},description='${description}',destination='${destination}',image='${image}',from_date='${fromDate}',to_date='${toDate}',price=${price},followers=${followers} WHERE id = ${id};`, `SELECT * from ${table} where id=${id};`, (err, newUpdatedVacation) => {
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

function setDate(date) {
    const dateFormated = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
    return dateFormated;
}

module.exports = {
    getVacations: getVacations,
    getSingleVacation: getSingleVacation,
    createVacation: createVacation,
    updateVacation: updateVacation,
    deleteVacation: deleteVacation,
}