  
function User(_id, name, role, phone, email, password, image) {
    this._id = _id;
    this.name = name;
    this.role = role;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.image = image;
}

module.exports = {
    User:User
}

