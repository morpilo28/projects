"use strict";

function User(id, firstName, lastName, userName, password, isAdmin) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.isAdmin = isAdmin;
}

module.exports = {
    User:User
};