"use strict";
//TODO: find a way to open and close connection to mysql only when needed

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "travel"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

function readAll(query, callback) {
    connection.query(query, (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });

}

function readOne(query, callback) {
    connection.query(query, (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function createOne(query1,query2, callback) {
    connection.query(query1, (err) => {
        if (err) {
            callback(err);
        } else {
            connection.query(query2, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}

function updateOne(query, callback) {
    connection.query(query, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

function deleteOne(query, callback) {
    connection.query(query, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports = {
    readAll: readAll,
    readOne: readOne,
    createOne: createOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};