const table = 'follow_vacation';
const followModel = require('../models/follow-model');
const dal = require('../dal');

function addFollow(followObjToAdd, callback) {
    //TODO: 
    //1. make insert img possible
    followObjToAdd = modalFollowObj(followObjToAdd);
    const { userId, vacationId } = followObjToAdd;
    dal.createOne(`insert into ${table} (user_id, vacation_id) values (${userId}, ${vacationId});`, `select * from ${table};`, (e, allFollowedVacation) => {
        if (e) {
            callback('vacation already followed');
        } else {
            callback(null);
        }
    })
}

function deleteFollow(followObjToAdd, callback) {
    followObjToAdd = modalFollowObj(followObjToAdd);
    dal.deleteOne(`delete from ${table} where user_id = ${followObjToAdd.userId} and vacation_id = ${followObjToAdd.vacationId}`, (e) => {
        if (e) {
            callback('problem with deleting');
        } else {
            callback(null, followObjToAdd.vacationId);
        }
    })
}

function modalFollowObj(followObjToAdd) {
    followObjToAdd.userId = Number(followObjToAdd.userId);
    followObjToAdd.vacationId = Number(followObjToAdd.vacationId);
    followObjToAdd = new followModel.Follow(followObjToAdd.userId, followObjToAdd.vacationId);
    return followObjToAdd;
}

function getOneVacationFollowed(vacationId, callback) {
    dal.readAll(`select * from ${table} where vacation_id = ${vacationId};`, (e, data) => {
        if (e) {
            callback('vacation already followed');
        } else {
            callback(null, data);
        }
    })
}

function deleteAllVacationFollow(vacationId, callback) {
    dal.deleteOne(`delete from ${table} where vacation_id = ${vacationId}`, (e) => {
        if (e) {
            console.log(e);
            callback('problem with deleting');
        } else {
            callback(null);
        }
    })
}
module.exports = {
    addFollow: addFollow,
    deleteFollow: deleteFollow,
    getOneVacationFollowed: getOneVacationFollowed,
    deleteAllVacationFollow: deleteAllVacationFollow
}