'use strict';

const fs = require('fs');
const path = require('path').resolve(__dirname, '..');

function deleteImageFromFolder(imageName,imgFolder, cb) {
    let ImageToDelete = (`${path}/images/${imgFolder}/${imageName}`);
    fs.unlink(ImageToDelete, (err) => {
        if (err) {
            console.log(`problem with deleting image from ${imgFolder}`);
            console.log(err);
            cb(err);
        }else{
            cb(null, {isDeleted: true});
        }
    });
}

module.exports = {
    deleteImageFromFolder:deleteImageFromFolder
};

