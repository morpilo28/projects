'use strict';

//TODO: create functions and put each code line in his matching function:
//get('administrator').then(res => console.log(res)); // from bl
//getOne('administrator', "5e57cf70b97e27183cd46a6c").then(res => console.log(res)); // from bl 
//insert('administrator', { "name": "oz", "role": "sales" }).then(res => console.log(res)); // from bl 
//update('administrator', { "_id": "5e57db8de8e843269831a5a6", "name": "solki", "role": "bitch" }).then(res => console.log(res)); // from bl 
//deleteDocument('administrator', "5e57f0dcd50ad031e09207f4").then(res => console.log("id dDeleted: "+ res)); // from bl 

const studentCollection = 'student';
const courseCollection = 'course';
const dal = require('../dal');

function get(cb) {
    dal.get(studentCollection, (e, d) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            cb(null, d);
        }
    });
}

function getOne(id, cb) {
    dal.getOne(studentCollection, id, (e, student) => {
        if (e) {
            console.log("can't get student");
        } else {
            cb(null, student);
        }
    });
}

function insertOne(studentToAdd, cb) {
    dal.insert(studentCollection, studentToAdd, (e, studentInserted) => {
        if (e) {
            console.log("can't insert student");
        } else {
            const studentToAddToCourse = { ...studentToAdd };
            delete studentToAddToCourse['courses'];
            for (let i = 0; i < studentToAdd.courses.length; i++) {
                //if (studentToAdd.courses[i].isChecked) { // put students in courses
                dal.pushToArray(courseCollection, studentToAdd.courses[i]._id, studentToAddToCourse, (e, singleCourse) => {
                    if (e) {
                        cb("can't insert student into his checked courses");
                    } else {
                        console.log('inserter student into checked course');
                    }
                });
                //}
            }
            cb(null, studentInserted);
        }
    });
}

function updateOne(studentData, cb) {
    const studentNewDataToUpdate = studentData.new;
    dal.update(studentCollection, studentNewDataToUpdate, (e, studentUpdated) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            //TODO: take the new and old arrays
            //TODO: check if which courses among them were added and which was remove
            //TODO: create a new array of 2 keys: id, action (add/remove).
            //TODO: iterate on this new array
            //TODO: extract a course from the courses collection (by id)
            //TODO: if action === 'add' then add the student to the course students array and send to db for update
            //TODO: if action === 'remove' then remove the student from the course students array and send to db for update
            //TODO: send back to cb the updated student obj
            
            dal.get(courseCollection, (e, allCourses) => {
                if (e) {
                    console.log('problem with getting courses list');
                } else {
                    //const studentData = {old: this.studentOldData, new:this.studentNewData}
                    //const coursesToUpdate = [];
                    //TODO: create the coursesToUpdate array that should add or delete the student
                    /* coursesToUpdate.forEach((course) => {
                        dal.update(courseCollection, course, (e, d) => {
                            if (e) {
                                console.log('problem with updating the courses that students where deleted from');
                            } else {
                                console.log('courses updated');
                            }
                        })
                    }) */
                }
            });
            cb(null, studentData);
        }
    });
}

function deleteOne(studentToDeleteId, cb) {
    dal.deleteDocument(studentCollection, studentToDeleteId, (e, studentDeletedId) => {
        if (e) {
            console.log('problem with deleting student');
            cb('problem with deleting student');
        } else {
            dal.get(courseCollection, (e, allCourses) => {
                if (e) {
                    console.log('problem with getting courses list');
                } else {
                    let coursesToUpdate = [];
                    for (let i = 0; i < allCourses.length; i++) {
                        const singleCourseStudents = allCourses[i].courseStudents;
                        for (let j = 0; j < (singleCourseStudents).length; j++) {
                            const studentId = singleCourseStudents[j]
                            if (((studentId._id).toString()) === studentToDeleteId) {
                                (singleCourseStudents).splice(j, 1);
                                //go to dal and update the course without one student
                                coursesToUpdate.push(allCourses[i]);
                            }
                        }
                    }
                    console.log(coursesToUpdate);
                    coursesToUpdate.forEach((course) => {
                        dal.update(courseCollection, course, (e, d) => {
                            if (e) {
                                console.log('problem with updating the courses that students where deleted from');
                            } else {
                                console.log('courses that students where deleted from were updated');
                            }
                        })
                    })
                }
            });
            cb(null, studentDeletedId);
        }
    });
}

module.exports = {
    get: get,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
}

/* 

  const studentToAddToCourse = { ...studentData };
                    const _allCourses = [...allCourses];
                    delete studentToAddToCourse['courses']
                    let isAlreadyEnrolled = false;
                    let coursesToUpdate = [];
                    //iterates through all courses
                    for (let i = 0; i < allCourses.length; i++) {
                        const course = allCourses[i];
                        //iterates through courses that the student is enrolled to 
                        for (let j = 0; j < (studentData.courses).length; j++) {
                            const studentCourse = studentData.courses[j];
                            //if the student is enrolled to the course
                            if (course._id.toString() === studentCourse._id) {
                                //iterates through students that are already enrolled to the course
                                for (let x = 0; x < (course.courseStudents).length; x++) {
                                    const student = course.courseStudents[x];
                                    //if the student is enrolled to the course
                                    if (student._id.toString() === studentData._id.toString()) {
                                        isAlreadyEnrolled = true;
                                        console.log('do something');
                                        break;
                                    }
                                }
                                if (!isAlreadyEnrolled) {
                                    _allCourses[i].courseStudents.push(studentToAddToCourse);
                                    coursesToUpdate.push(_allCourses[i]);
                                }
                            } else { // if student didn't or no longer enrolled in the course
                                for (let z = 0; z < (course.courseStudents).length; z++) {
                                    const student = course.courseStudents[z];
                                    if (student._id.toString() === studentData._id.toString()) {
                                        (_allCourses[i].courseStudents).splice(z, 1);
                                        coursesToUpdate.push(_allCourses[i]);
                                    }
                                }
                            }
                        }
                    }

*/