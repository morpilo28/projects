'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const imgFolder = 'userImages';
const deleteUtils = require('../utils/deleteImage');
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
const userBl = require('../business-logic/user-bl');
const dal = require('../dal');

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, path.join(__dirname, '/../images/userImages')); },
        filename: function (req, file, callback) { callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname)); }
    }),
    fileFilter: function (req, file, callback) { isFileTypeImg(file, callback) }
}).single('imgFile');

function isFileTypeImg(file, callback) {
    const fileType = /jpeg|jpg|png|gif/;
    const extName = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = fileType.test(file.mimetype);
    if (extName && mimeType) {
        callback(null, true);
    } else {
        callback('file type not supported. image type only');
    }
}

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
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex),
    };

    userBl.isUserExist(userToValidate, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    });
});

router.post('/register', (req, res) => {
    const userToAdd = req.body;
    userToAdd.password = CryptoJS.SHA256(userToAdd.password).toString(CryptoJS.enc.Hex);

    userBl.insertOne(userToAdd, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    });
})

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

router.delete('/:id', (req, res) => {
    const userToDeleteId = req.params.id;
    userBl.deleteOne(userToDeleteId, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    })
});

router.post('/images', upload, (req, res) => {
    upload(req, res, (e) => {
        if (e) {
            return res.status(500).end('problem with uploading img');
        } else {
            const resObj = { fileName: req.file.filename }
            return res.send(resObj);
        }
    })
})

router.delete('/images/:imgName', (req, res) => {
    const imageName = req.params.imgName;
    deleteUtils.deleteImageFromFolder(imageName, imgFolder, (e,d)=>{
        if(e){
            return res.status(500).end('problem with deleting user img');
        }else{
            return res.send(d);
        }
    });
})

module.exports = router;