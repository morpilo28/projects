'use strict';

const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';

const userController = require('./controllers/users.ctrl');
const courseController = require('./controllers/course.ctrl');
const studentController = require('./controllers/student.ctrl');

//TODO: add middleware for token validation

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '/images')));

app.use((req, res, next) => {

    const allowed = {
        onLogin: req.method === 'POST' && req.path === '/user/login',
    }

    if (allowed.onLogin) {
        next();
    } else {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                jwt.verify(token, SECRET_KEY_FOR_JWT);
                next();
            } catch (ex) {
                res.status(401).send('Not authorize request');
            }
        } else {
            res.status(401).send("Request doesn't have a header authorization");
        }
    }
})

app.use('/user', userController);
app.use('/course', courseController);
app.use('/student', studentController);

app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on port ${process.env.PORT || PORT}!`);
});

