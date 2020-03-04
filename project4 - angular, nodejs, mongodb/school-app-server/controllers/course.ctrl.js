'use strict';
const express = require('express');
const router = express.Router();
const courseBl = require('../business-logic/course-bl');

router.get('/', (req, res) => {
    //get('administrator').then(res => console.log(res)); // from bl
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
    //get('administrator').then(res => console.log(res)); // from bl
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

module.exports = router;