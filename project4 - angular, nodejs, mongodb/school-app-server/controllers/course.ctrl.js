'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const imgFolder = 'courseImages';
const deleteUtils = require('../utils/deleteImage');
const courseBl = require('../business-logic/course-bl');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, path.join(__dirname, '/../images/courseImages')); },
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
    courseBl.get((err, allCourses) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(allCourses);
        }
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    courseBl.getOne(id, (err, singleCourse) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(singleCourse);
        }
    })
});

router.post('/', (req, res) => {
    const courseToAdd = req.body;
    courseBl.insertOne(courseToAdd, (err, insertedCourse) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(insertedCourse);
        }
    });
});

router.put('/', (req, res) => {
    const courseNewData = req.body;
    courseBl.updateOne(courseNewData, (err, updatedCourse) => {
        if (err) {
            return res.status(500).send();
        } else {
            return res.send(updatedCourse);
        }
    })
});

router.delete('/:id', (req, res) => {
    const courseToDeleteId = req.params.id;
    courseBl.deleteOne(courseToDeleteId, (err, deletedId) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(deletedId);
        }
    })
});

router.post('/images', upload, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).end('problem with uploading img');
        } else {
            const resObj = { fileName: req.file.filename };
            return res.send(resObj);
        }
    })
});

router.delete('/images/:imgName', (req, res) => {
    const imageName = req.params.imgName;
    deleteUtils.deleteImageFromFolder(imageName, imgFolder, (err, isImgDeleted) => {
        if (err) {
            return res.status(500).end('problem with deleting course img');
        } else {
            return res.send(isImgDeleted);
        }
    });
});

module.exports = router;