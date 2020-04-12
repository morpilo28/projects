/* mongodb init */
//TODO: insert updated objects for each collection (image must exist on server older)
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const DATABASE = 'school'
const courseCollection = 'course';
const studentCollection = 'student';
const administratorCollection = 'administrator';

MongoClient.connect(url, createNewMongoClient(), (err, db) => {
    if (err) throw err;
    const dbo = db.db(DATABASE);
    const course = {
        "name": "b",
        "description": "b",
        "image": "butterfly-1586711510562.jpg",
        "courseStudents": []
    }
    const student = {
        "name": "yael",
        "phone": "067-2674389",
        "email": "yael@gmail.com",
        "image": "yael-1586711498318.jpg",
        "courses": []
    };
    const administrator = {
        "name": "mor",
        "role": "owner",
        "phone": "052-420682544",
        "email": "mor@gmail.com",
        "password": "30d425858b2467d1f74251cc9e5dcc69a57009a669856a4ca8bb76a5a58f7e09",
        "image": "mor-1586711450125.jpg"
    };
    createDbStarter(dbo, db, courseCollection, course);
    createDbStarter(dbo, db, studentCollection, student);
    createDbStarter(dbo, db, administratorCollection, administrator);
});

function createDbStarter(dbo, db, collection, obj) {
    dbo.collection(collection).insertOne(obj, function (err, res) {
        if (err) throw err;
        console.log(`${collection} document inserted`);
        db.close();
    });
}

function createNewMongoClient() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}