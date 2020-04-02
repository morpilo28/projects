'use strict';

function Course(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.description = obj.description;
    this.image = obj.image;
    this.courseStudents = obj.courseStudents;
}

module.exports = {
    Course: Course
}

