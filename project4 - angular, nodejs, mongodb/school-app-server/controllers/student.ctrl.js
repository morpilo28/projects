'use strict';
const express = require('express');
const router = express.Router();
const studentBl = require('../business-logic/student-bl');

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

module.exports = router;