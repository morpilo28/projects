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

//TODO: check if works;
function updateOne(studentToUpdate, cb) {
    dal.update(studentCollection, studentToUpdate, (e, studentUpdated) => {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            // get all the courses ------
            // iterate through all the courses -----
            // and check"
            // if the courses id's in studentToUpdate.studentCourses match the course id in allCourses then 
            //check if that course have this student.
            //if not, add it. if yes do nothing
            //else 
            // check if that course have this student.
            // if yes, delete it. if not, do nothing. 

            dal.get(courseCollection, (e, allCourses) => {
                if (e) {
                    console.log('problem with getting courses list');
                } else {
                    const studentToAddToCourse = { ...studentToUpdate };
                    delete studentToAddToCourse['courses']
                    let isAlreadyEnrolled = false;
                    let coursesToUpdate = [];
                    for (let i = 0; i < allCourses.length; i++) {
                        const course = allCourses[i];
                        for (let j = 0; j < (studentToUpdate.courses).length; j++) {
                            const studentCourse = studentToUpdate.courses[j];
                            if (course._id.toString() === studentCourse._id) {
                                for (let x = 0; x < (course.courseStudents).length; x++) {
                                    const student = course.courseStudents[x];
                                    if (student._id.toString() === studentToUpdate._id.toString()) {
                                        isAlreadyEnrolled = true;
                                        break;
                                    }
                                }
                                if (!isAlreadyEnrolled) {
                                    course.courseStudents.push(studentToAddToCourse);
                                    coursesToUpdate.push(course);
                                }
                            } else { // if student didn't or no longer enrolled in the course
                                for (let z = 0; z < (course.courseStudents).length; z++) {
                                    const student = course.courseStudents[z];
                                    if (student._id.toString() === studentToUpdate._id.toString()) {
                                        (course.courseStudents).splice(z, 1);
                                        coursesToUpdate.push(course);
                                    }
                                }
                            }
                        }
                    }
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
            cb(null, studentToUpdate);
        }
    });
}

//TODO: check if works;
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
                    console.log(allCourses);
                    let coursesToUpdate = [];
                    for (let i = 0; i < allCourses.length; i++) {
                        const singleCourseStudents = allCourses[i].courseStudents;
                        console.log(singleCourseStudents);
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

                    //cb(null, d);
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