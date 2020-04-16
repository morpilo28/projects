"use strict";

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const ObjectId = require('mongodb').ObjectId;
const DATABASE = 'school';

function get(collection, cb) {
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            DB.collection(collection).find().toArray((err, d) => {
                if (err) {
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
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            filterValue = new ObjectId(filterValue);
            DB.collection(collection).findOne({ _id: filterValue }, (err, d) => {
                if (err) {
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
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            DB.collection(collection).insertOne(documentToAdd, (err, insertedDocument) => {
                if (err) {
                    console.log('cant insert document');
                    cb('cant insert document');
                } else {
                    cb(null, insertedDocument.ops[0]);
                    closeMongoConnection(client);
                }
            });
        }
    });
}

function pushToArray(collection, id, objToPush, cb) {
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            id = new ObjectId(id);
            DB.collection(collection).updateOne({ _id: id }, { $push: { courseStudents: objToPush } }, (err, res) => {
                if (err) {
                    console.log("can't update on push to array func");
                    cb("can't update on push to array func");
                } else {
                    DB.collection(collection).findOne({ _id: id }, (err, d) => {
                        if (err) {
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

function update(collection, documentNewDataToUpdate, cb) {
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            documentNewDataToUpdate._id = new ObjectId(documentNewDataToUpdate._id);
            DB.collection(collection).updateOne({ _id: documentNewDataToUpdate._id }, { $set: documentNewDataToUpdate }, (err, res) => {
                if (err) {
                    console.log("can't update document");
                    cb("can't update document");
                } else {
                    DB.collection(collection)
                    .findOne({ _id: documentNewDataToUpdate._id }, (err, updatedDocument) => {
                        if (err) {
                            console.log("can't find updated document");
                            cb("can't find updated document");
                        } else {
                            cb(null, updatedDocument);
                            closeMongoConnection(client);
                        }
                    });
                }
            });
        }
    });
}

function deleteDocument(collection, documentIdToDelete, cb) {
    MongoClient.connect(url, createNewMongoClient(), (err, client) => {
        if (err) {
            console.log('problem connecting to mongoDB');
            cb('problem connecting to mongoDB');
        } else {
            const DB = getDb(client);
            documentIdToDelete = new ObjectId(documentIdToDelete);
            DB.collection(collection).deleteOne({ _id: documentIdToDelete }, (err, deletionData) => {
                if (err) {
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