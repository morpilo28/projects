"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const vacationBl = require('./routing/vacations-bl');
const usersBl = require('./routing/users-bl');
const PORT = 3201;
const cors = require('cors');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';

app.use('/images', express.static(path.join(__dirname, '/images')));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    const allowed = {
        client: req.method === 'GET' && req.path === '/vacations/' && req.query.client === 'client',
        register: req.method === 'POST' && req.path === '/register',
        login: req.method === 'POST' && req.path === '/login',
        upload: req.method === 'POST' && req.path === '/uploadImages',
        imgSrc: req.method === 'GET' && (req.path.indexOf('images') > -1)
    };

    if (allowed.register || allowed.login || allowed.client || allowed.upload || allowed.imgSrc) {
        next();
    } else {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                jwt.verify(token, SECRET_KEY_FOR_JWT);
                next()
            } catch (ex) {
                res.status(401).send();
            }
        } else {
            res.status(401).send();
        }
    }
});

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, path.join(__dirname, 'images')); },
        filename: function (req, file, callback) { callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname)); }
    }),
    fileFilter: function (req, file, callback) { isFileTypeImg(file, callback) }
}).single('imgFile');

function isFileTypeImg(file, callback) {
    const fileType = /jpeg|jpg|png|gif/;
    const extName = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = fileType.test(file.mimetype);
    if (extName && mimeType) {
        return callback(null, true);
    } else {
        callback('file type not supported. image type only');
    }
}

app.get('/vacations', (req, res) => {
    const userId = req.query.userId;
    let forChart = '';
    if (req.query.forChart) {
        forChart = req.query.forChart;
    } else {
        forChart = 'false';
    }
    vacationBl.getVacations(userId, (e, data) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    }, forChart);
});

app.post('/vacations', (req, res) => {
    const vacationToAddObj = req.body;
    vacationBl.createVacation(vacationToAddObj, (e, vacation) => {
        if (e) {
            if (e === 400) {
                return res.status(400).send('vacation already exist');
            } else {
                return res.status(500).send(e);
            }
        } else {
            io.emit('ADD_VACATION', vacation);
            return res.send();
        }
    })
});

app.put('/vacations/:id', (req, res) => {
    const editedVacationData = req.body;
    vacationBl.updateVacation(editedVacationData, (e, updatedVacation) => {
        if (e) {
            return res.status(e).send();
        } else {
            io.emit('EDIT_VACATION', updatedVacation);
            return res.send();
        }
    })
});

app.delete('/vacations/:id', (req, res) => {
    const vacationId = req.body.id;
    const userId = req.body.userId;
    const imageName = req.body.imageName;

    vacationBl.deleteVacation(vacationId, userId, imageName, (e) => {
        if (e) {
            return res.status(500).send();
        } else {
            io.emit('DELETE_VACATION', { id: vacationId });
            return res.end();
        }
    })
});

app.post('/login', function (req, res) {
    const userToValidate = {
        userName: req.body.userName,
        password: req.body.password,
    };
    usersBl.validateUser(userToValidate, (e, user) => {
        if (e) {
            return res.status(400).send('no user has been found');
        } else {
            const token = jwt.sign({
                userName: req.body.userName
            }, SECRET_KEY_FOR_JWT,
                {
                    expiresIn: '365d'
                });
            const responseObj = {
                token: token,
                userName: user.userName,
                userId: user.id,
                isAdmin: user.isAdmin
            };
            return res.send(responseObj);
        }
    })
});

app.post('/register', function (req, res) {
    const userToAdd = req.body;
    usersBl.isUserNameAlreadyExist(userToAdd, (e) => {
        if (e) {
            res.status(400).send('user name taken. please select a different name');
        } else {
            usersBl.registerUser(userToAdd, (e) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    return res.send();
                }
            })
        }
    })
});

app.post('/follow', function (req, res) {
    const followObjToAdd = req.body;
    usersBl.checkIfFollowed(followObjToAdd, (e, data) => {
        if (e) {
            return res.status(400).send(e);
        } else {
            return res.send(data);
        }
    })
});

app.post('/uploadImg', upload, (req, res) => {
    upload(req, res, (e) => {
        if (e) {
            return res.status(500).end('problem with uploading img');
        } else {
            console.log('image added: ' + req.file.filename);
            return res.send(req.file.filename);
        }
    })
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);