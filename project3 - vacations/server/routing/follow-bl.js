const table = 'follow_vacation';
const followModel = require('../models/follow-model');
const dal=require('../dal');

function addFollow(followObjToAdd, callback) {
    //TODO: 
    //1. make insert img possible
    followObjToAdd.userId = Number(followObjToAdd.userId);
    followObjToAdd.vacationId = Number(followObjToAdd.vacationId);
    followObjToAdd = new followModel.Follow(followObjToAdd.userId, followObjToAdd.vacationId);
    const { userId, vacationId } = followObjToAdd;
    dal.createOne(`insert into ${table} (user_id, vacation_id) values (${userId}, ${vacationId});`,`select * from ${table};`,(e, allFollowedVacation) => {
        if (e) {
            callback('vacation already been followed');
        } else {
            callback(null);
        }
    })

}

module.exports = {
    addFollow: addFollow,
}