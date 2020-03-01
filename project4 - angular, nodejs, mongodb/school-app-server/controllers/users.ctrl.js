const express = require('express');
const router = express.Router();
const userBl = require('../business-logic/user-bl');
const SECRET_KEY_FOR_JWT = '687d6f87sd6f87sd6f78sd6f87sd';
const jwt = require('jsonwebtoken');
const dal = require('../dal');
const usersCollection = 'administrator';

router.get('/', (req, res) => {
    //get('administrator').then(res => console.log(res)); // from bl
    dal.get(usersCollection).then(response=>{
        return res.send(response);    
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
                userName:userToValidate.name
            },SECRET_KEY_FOR_JWT,
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

router.put('/', (req, res) => {
    res.send();
});

router.delete('/', (req, res) => {
    res.send();
});

module.exports = router;