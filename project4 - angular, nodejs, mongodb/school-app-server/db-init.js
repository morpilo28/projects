/* mongodb init */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const DATABASE = 'school';
const courseCollection = 'course';
const studentCollection = 'student';
const administratorCollection = 'administrator';
const ENTITIES = {
    courses: [{
        "name": "animal studies",
        "description": "Animal studies is a recently recognized field in which animals are studied in a variety of cross-disciplinary ways.",
        "image": "tiger-1587395269478.jpg",
        "courseStudents": []
    },
    {
        "name": "surviving the desert",
        "description": "How to survive in the desert with only a computer",
        "image": "desert-1587395336571.jpg",
        "courseStudents": []
    },
    {
        "name": "lego architecture ",
        "description": "Design and build your own perfect world using lego",
        "image": "city-1587395491410.jpg",
        "courseStudents": []
    },
    {
        "name": "Keep Your Plants Alive",
        "description": "A crash course on how to keep your plants alive for more than a few days",
        "image": "Hyacinthus-1587396302881.jpg",
        "courseStudents": []
    },
    {
        "name": "surfing",
        "description": "Surfing in Jerusalem",
        "image": "surf-1587396384306.jpg",
        "courseStudents": []
    }
    ],
    students: [
        {
            "name": "doc",
            "phone": "02-5724477",
            "email": "doc@gmail.com",
            "image": "doc-1587394990077.JPG",
            "courses": []
        },
        {
            "name": "dopey",
            "phone": "08-6732667",
            "email": "dopey@gmail.com",
            "image": "dopey-1587395028900.JPG",
            "courses": []
        },
        {
            "name": "bashful",
            "phone": "057-9812224",
            "email": "bashful@gmail.com",
            "image": "bashful-1587394921862.JPG",
            "courses": []
        },
        {
            "name": "grumpy",
            "phone": "058-9995321",
            "email": "grumpy@gmail.com",
            "image": "grumpy-1587395059565.JPG",
            "courses": []
        },
    ],
    administrators: [
        {
            "name": "sleepy",
            "phone": "083-6498652",
            "email": "sleepy@gmail.com",
            "role": "owner",
            "image": "sleepy-1587394750302.JPG",
            "password": "e74ca13b4c0a61dcf7746ff71c1238e2cd1b5026838c8b3c5e147595aa627025"
        },
        {
            "name": "happy",
            "phone": "052-7853669",
            "email": "happy@gmail.com",
            "role": "sales",
            "image": "happy-1587394822251.JPG",
            "password": "489f719cadf919094ddb38e7654de153ac33c02febb5de91e5345cbe372cf4a0"
        },
        {
            "name": "sneezy",
            "phone": "054-8654772",
            "email": "sneezy@gmail.com",
            "role": "manager",
            "image": "sneezy-1587394861212.JPG",
            "password": "0df49a5d7f4741ecc76b8ace643a9cdba36a35926c486c4d2642ff083d19dd66"
        },
    ]
}

MongoClient.connect(url, createNewMongoClient(), (err, db) => {
    if (err) throw err;
    const dbo = db.db(DATABASE);

    createDbStarter(dbo, db, courseCollection, ENTITIES.courses);
    createDbStarter(dbo, db, studentCollection, ENTITIES.students);
    createDbStarter(dbo, db, administratorCollection, ENTITIES.administrators);
});

function createDbStarter(dbo, db, collection, array) {
    dbo.collection(collection).insertMany(array, function (err, res) {
        if (err) throw err;
        console.log(`${collection} documents inserted`);
        db.close();
    });
}

function createNewMongoClient() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}