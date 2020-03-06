'use strict';
const express = require('express');
const router = express.Router();
const studentBl = require('../business-logic/student-bl');
const courseBl = require('../business-logic/course-bl');

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

//check if it works
router.put('/', (req, res) => {
    const studentToUpdate = req.body;
    studentBl.updateOne(studentToUpdate, (e, data) => {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

//check if it works
router.delete('/', (req, res) => {
    const studentToDeleteId = req.body;
    studentBl.deleteOne(studentToDeleteId, (e, data) => {
        if (e) {
            console.log(e);
            return res.status(500).send(e);
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;