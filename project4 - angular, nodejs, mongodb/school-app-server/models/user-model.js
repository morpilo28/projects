'use strict';

function User(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.role = obj.role;
    this.phone = obj.phone;
    this.email = obj.email;
    this.password = obj.password;
    this.image = obj.image;
}

module.exports = {
    User:User
};

