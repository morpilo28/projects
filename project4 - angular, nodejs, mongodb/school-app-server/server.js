const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

const userController = require('./controllers/users.ctrl');
const courseController = require('./controllers/course.ctrl');
const studentController = require('./controllers/student.ctrl');

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userController);
app.use('/course', courseController);
app.use('/student', studentController);

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT || PORT}!`);
});