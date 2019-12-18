  
function Vacation(id, description, destination, image, fromDate, toDate, price, followers) {
    this.id = id;
    this.description = description;
    this.destination = destination;
    this.image = image;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.price = price;
    this.followers = followers;
}

module.exports = {
    Vacation:Vacation
}