"use strict";

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const ObjectId = require('mongodb').ObjectId;

//get('administrator').then(res => console.log(res)); // from bl
function get(collection) {
    return new Promise(async (resolve, reject) => {
        const client = createNewMongoClient();
        try {
            await connectToMongo(client);
            const db = getDb(client);
            const myCollection = db.collection(collection).find();

            resolve(await myCollection.toArray());
            closeMongoConnection(client);
        } catch (ex) {
            reject(ex);
        }
    });
}

//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
function getOne(collection, filterValue) {
    return new Promise(async (resolve, reject) => {
        const client = createNewMongoClient();
        try {
            await connectToMongo(client);
            const db = getDb(client);
            filterValue = new ObjectId(filterValue); 
            const singleDocument = await db.collection(collection).findOne({ _id: filterValue });
            resolve(singleDocument);
            closeMongoConnection(client);
        } catch (ex) {
            reject(ex);
        }
    });
}

//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
function insert(collection, documentToAdd) {
    return new Promise(async (resolve, reject) => {
        const client = createNewMongoClient();
        try {
            await connectToMongo(client);
            const db = getDb(client);

            db.collection(collection).insertOne(documentToAdd, (e, insertedDocument) => {
                resolve(insertedDocument.ops[0]);
                closeMongoConnection(client);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
function update(collection, documentToUpdate) {
    return new Promise(async (resolve, reject) => {
        const client = createNewMongoClient();
        try {
            await connectToMongo(client);

            const db = getDb(client);
            documentToUpdate._id = new ObjectId(documentToUpdate._id); //TODO: takes the string and make it to an ObjectId; needs to happend in the BL?!
            //maybe use replaceOne() instead of updateOne
            db.collection(collection).updateOne({ _id: documentToUpdate._id }, { $set: documentToUpdate }, async (e, res) => {
                const updatedDocument = await db.collection(collection).findOne({ _id: documentToUpdate._id });
                resolve(updatedDocument);
                closeMongoConnection(client);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 
function deleteDocument(collection, documentIdToDelete) {
    return new Promise(async (resolve, reject) => {
        const client = createNewMongoClient();
        try {
            await connectToMongo(client);
            const db = getDb(client);

            documentIdToDelete = new ObjectId(documentIdToDelete); //TODO: takes the string and make it to an ObjectId; needs to happend in the BL?!

            //maybe use replaceOne() instead of updateOne
            await db.collection(collection).deleteOne({ _id: documentIdToDelete });
            resolve(documentIdToDelete);
            closeMongoConnection(client);
        } catch (ex) {
            reject(ex);
        }
    });
}

function getDb(client) {
    return client.db('school');
}

async function connectToMongo(client) {
    await client.connect().then(() => console.log('DB Connected!')).catch(err => console.log('error'));
}

function closeMongoConnection(client) {
    client.close();
}

function createNewMongoClient() {
    return new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = {
    get: get,
    getOne: getOne,
    insert: insert,
    update: update,
    deleteDocument: deleteDocument
};