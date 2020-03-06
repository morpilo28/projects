"use strict";

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const ObjectId = require('mongodb').ObjectId;
const DATABASE = 'school'

function get(collection, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            DB.collection(collection).find().toArray((e, d) => {
                if (e) {
                    console.log('cant get data from collection');
                    cb('cant get data from collection');
                } else {
                    cb(null, d);
                    closeMongoConnection(client);
                }
            })
        }
    });
}

function getOne(collection, filterValue, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            filterValue = new ObjectId(filterValue);
            DB.collection(collection).findOne({ _id: filterValue }, (e, d) => {
                if (e) {
                    console.log('cant get data from collection');
                    cb('cant get data from collection');
                } else {
                    cb(null, d);
                    closeMongoConnection(client);
                }
            });
        }
    });
}

function insert(collection, documentToAdd, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            DB.collection(collection).insertOne(documentToAdd, (e, insertedDocument) => {
                if (e) {
                    console.log('cant get data from collection');
                    cb('cant get data from collection');
                } else {
                    //console.log(insertedDocument.ops[0])
                    cb(null, insertedDocument.ops[0]);
                    closeMongoConnection(client);
                }
            });
        }
    });
}

function pushToArray(collection, id, objToPush, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            id = new ObjectId(id);
            DB.collection(collection).updateOne({ _id: id }, { $push: { courseStudents: objToPush } }, (e, res) => {
                if (res) {
                    console.log("can't update");
                    //cb("can't update");
                } else {
                    DB.collection(collection).findOne({ _id: id }, (e, d) => {
                        if (e) {
                            cb("can't get updated document");
                            console.log("can't get updated document");
                        } else {
                            cb(null, d);
                        }
                    });
                }
            });
        }
    });
}

//TODO: check if works;
function update(collection, documentToUpdate, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            documentToUpdate._id = new ObjectId(documentToUpdate._id); //TODO: takes the string and make it to an ObjectId; needs to happend in the BL?!
            //maybe use replaceOne() instead of updateOne
            DB.collection(collection).updateOne({ _id: documentToUpdate._id }, { $set: documentToUpdate }, (e, res) => {
                if (res) {
                    console.log("can't update document");
                    cb("can't update document");
                } else {
                    DB.collection(collection).findOne({ _id: documentToUpdate._id }, (e, d) => {
                        if (e) {
                            console.log("can't find updated document");
                            cb("can't find updated document");
                        } else {
                            cb(null, d);
                            closeMongoConnection(client);
                        }
                    });
                }
            });
        }
    });
}

//TODO: check if works;
function deleteDocument(collection, documentIdToDelete, cb) {
    MongoClient.connect(url, createNewMongoClient(), (e, client) => {
        if (e) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            documentIdToDelete = new ObjectId(documentIdToDelete); //TODO: takes the string and make it to an ObjectId; needs to happend in the BL?!
            DB.collection(collection).deleteOne({ _id: documentIdToDelete }, (e, d) => {
                if (e) {
                    console.log('cant delete from collection');
                    cb('cant delete from collection');
                } else {
                    cb(null, documentIdToDelete);
                    closeMongoConnection(client);
                }
            });
        }
    });
}

function getDb(client) {
    return client.db(DATABASE);
}

function closeMongoConnection(client) {
    client.close();
}

function createNewMongoClient() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = {
    get: get,
    getOne: getOne,
    insert: insert,
    update: update,
    deleteDocument: deleteDocument,
    pushToArray: pushToArray,

};