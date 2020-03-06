'use strict';
const express = require('express');
const router = express.Router();
const studentBl = require('../business-logic/student-bl');
const courseBl = require('../business-logic/course-bl');

router.get('/', (req, res) => {
    //get('administrator').then(res => console.log(res)); // from bl
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
    //get('administrator').then(res => console.log(res)); // from bl
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
            console.log(data);
            //return res.send(data);
        }
    });
})

module.exports = router;