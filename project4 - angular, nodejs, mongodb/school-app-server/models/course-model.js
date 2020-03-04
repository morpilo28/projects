
function Course(_id, name, description, email, image) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.image = image;
}

module.exports = {
    Course: Course
}

