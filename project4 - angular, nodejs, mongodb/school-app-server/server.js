const express = require('express');
const app = express();
const PORT = 5000;
const dal = require('./dal');


const userController = require('./controllers/users.ctrl');

app.use('/user', userController);


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT || PORT}!`);
});