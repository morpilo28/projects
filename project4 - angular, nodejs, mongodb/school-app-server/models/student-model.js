
function Student(_id, name, phone, email, image) {
    this._id = _id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.image = image;
}

module.exports = {
    Student: Student
}

