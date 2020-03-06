const express = require('express');
const router = express.Router();
const userBl = require('../business-logic/user-bl');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
const jwt = require('jsonwebtoken');
const dal = require('../dal');

router.get('/', (req, res) => {
    userBl.get((e, allUsers) => {
        if (e) {
            console.log(e);
            return res.status(500).send();
        } else {
            return res.send(allUsers);
        }
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    userBl.getOne(id, (e, singleUser) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(singleUser);
        }
    })
});

router.post('/login', (req, res) => {
    const userToValidate = {
        name: req.body.name,
        password: req.body.password,
    };

    userBl.isUserExist(userToValidate, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            const token = jwt.sign({
                userName: userToValidate.name
            }, SECRET_KEY_FOR_JWT,
                {
                    expiresIn: '365d'
                });

            const resObj = {
                name: data.name,
                role: data.role,
                image: data.image,
                token: token
            }
            return res.send(resObj);
        }
    });
});

//TODO: check if i used it. if not use the regular post
router.post('/register', (req, res) => {
    const userToAdd = req.body;
    userBl.insertOne(userToAdd, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    });
})

router.post('/', (req, res) => {
    const userToAdd = req.body;
    userBl.insertOne(userToAdd, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    });
})

//check if it works
router.put('/', (req, res) => {
    const userToUpdate = req.body;
    userBl.updateOne(userToUpdate, (e, data) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

//check if it works
router.delete('/', (req, res) => {
    const userToDeleteId = req.body;
    userBl.deleteOne(userToDeleteId, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;