const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const vacationBl = require('./routing/vacations-bl');
const usersBl = require('./routing/users-bl');
const userModel = require('./models/user-model');
const PORT = 3201;
const cors = require('cors');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    /*  console.log({
         method: req.method,
         path: req.path,
         originalUrl: req.originalUrl,
         body: req.body,
         params: req.params,
         query: req.query,
         url: req.url
     }) */
    const allowed = {
        client: req.method === 'GET' && req.path === '/vacations/' && req.query.client === 'client',
        register: req.method === 'POST' && req.path === '/register',
        login: req.method === 'POST' && req.path === '/login',
    }

    if (allowed.register || allowed.login || allowed.client) {
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
})

app.get('/vacations', (req, res) => {
    vacationBl.getVacations((e, allVacations) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(allVacations);
        }
    })
})

app.get('/vacations/:id', (req, res) => {
    const id = Number(req.params.id);
    vacationBl.getVacations((e, allVacations) => {
        if (e) {
            return res.status(500).send();
        } else {
            vacationBl.getSingleVacation(id, (e, singleVacationData) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    responseObj = {
                        singleVacationData: singleVacationData,
                        allVacations: allVacations
                    }
                    return res.send(responseObj);
                }
            })
        }
    })
})

app.post('/vacations', (req, res) => {
    const vacationToAddObj = req.body;
    vacationToAddObj.id = Number(vacationToAddObj.id);
    vacationBl.createVacation(vacationToAdd, (e) => {
        if (e) {
            return res.status(500).send();
        } else {
            vacationBl.getVacations((e, allVacations) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    return res.send(allVacations);
                }
            })
        }
    })
})

app.put('/vacations/:id', (req, res) => {
    const editedVacationData = req.body;
    editedVacationData.id = Number(req.params.id);
    vacationBl.updateVacation(editedVacationData, (e, newUpdatedVacationId) => {
        if (e) {
            return res.status(500).send();
        } else {
            vacationBl.getVacations((e, allVacations) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    const responseObj = {
                        newUpdatedVacationId: newUpdatedVacationId,
                        allVacations: allVacations
                    }
                    return res.send(responseObj);
                }
            })
        }
    })
})

app.delete('/vacations/:id', (req, res) => {
    const id = Number(req.body.id);
    vacationBl.deleteVacation(id, (e) => {
        if (e) {
            return res.status(500).send();
        } else {
            vacationBl.getVacations((e, allVacations) => {
                if (e) {
                    return res.status(500).send();
                } else {
                    return res.send(allVacations);
                }
            })
        }
    })
})

app.post('/login', function (req, res) {
    const userToValidate = {
        userName: req.body.userName,
        password: req.body.password,
    }
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
            return res.send(token);
        }
    })
});

app.post('/register', function (req, res) {
    const userToAdd = new userModel.User(req.body.id, req.body.firsName, req.body.lastName, req.body.userName, req.body.password, req.body.isAdmin);
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

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT || PORT}!`),
);