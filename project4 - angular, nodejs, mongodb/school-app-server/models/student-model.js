'use strict';

function Student(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.phone = obj.phone;
    this.email = obj.email;
    this.image = obj.image;
    this.courses = obj.courses;
}

module.exports = {
    Student: Student
};

