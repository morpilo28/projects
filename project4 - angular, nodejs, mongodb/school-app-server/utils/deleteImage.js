'use strict';

const fs = require('fs');
const path = require('path').resolve(__dirname, '..');

function deleteImageFromFolder(imageName,imgFolder, cb) {
    let ImageToDelete = (`${path}/images/${imgFolder}/${imageName}`);
    fs.unlink(ImageToDelete, (e,d) => {
        if (e) {
            console.log('problem with deleting image from student folder');
            console.log(e);
            cb(e);
        }else{
            cb(null, {isDeleted: true});
        }
    });
}

module.exports = {
    deleteImageFromFolder:deleteImageFromFolder
}

