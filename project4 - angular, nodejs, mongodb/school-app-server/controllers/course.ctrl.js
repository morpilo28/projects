'use strict';
const express = require('express');
const router = express.Router();
const courseBl = require('../business-logic/course-bl');

router.get('/', (req, res) => {
    courseBl.get((e, data) => {
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
    courseBl.getOne(id, (e, singleCourse) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(singleCourse);
        }
    })
});

router.post('/', (req, res) => {
    const courseToAdd = req.body;
    courseBl.insertOne(courseToAdd, (e, data) => {
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
    const courseToUpdate = req.body;
    courseBl.updateOne(courseToUpdate, (e, data) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

//check if it works
router.delete('/', (req, res) => {
    const courseToDeleteId = req.body;
    courseBl.deleteOne(courseToDeleteId, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;