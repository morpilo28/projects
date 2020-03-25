'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const studentBl = require('../business-logic/student-bl');
const courseBl = require('../business-logic/course-bl');

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, path.join(__dirname, '/../images/studentImages')); },
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
    studentBl.get((e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    studentBl.getOne(id, (e, singleStudent) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(singleStudent);
        }
    })
});

router.post('/', (req, res) => {
    const studentToAdd = req.body;
    studentBl.insertOne(studentToAdd, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    });
})

router.put('/', (req, res) => {
    const studentData = req.body;
    studentBl.updateOne(studentData, (e, data) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

router.delete('/:id', (req, res) => {
    const studentToDeleteId = req.params.id;
    studentBl.deleteOne(studentToDeleteId, (e, data) => {
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

router.delete('/images/:imgName', (req,res)=>{
    const imageName = req.params.imgName;
    studentBl.deleteImageFromFolder(imageName);
})

module.exports = router;
