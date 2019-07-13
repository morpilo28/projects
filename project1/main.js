//project 1 - final version
"use strict";
var notesArray = [];
var idCounter = 0;
var tasksAdded = document.getElementById('tasksAdded');
var taskInput = document.getElementById('taskInput');
var dateInput = document.getElementById('dateInput');
var timeInput = document.getElementById('timeInput');

document.getElementById('saveBtn').addEventListener('click', addTask);
document.getElementById('cleanFormBtn').addEventListener('click', cleanForm);

restoreFromLocalStorage();

function restoreFromLocalStorage() {
    if ((window.localStorage.getItem('task')) != null) {
        notesArray = JSON.parse(window.localStorage.getItem('task'));
        idCounter = parseInt(window.localStorage.getItem('lastIdCounter'));
        printTasks();
    }
}

function printTasks() {
    for (let i = 0; i < notesArray.length; i++) {
        printTask(notesArray[i]);
    }
}

function printTask(note, withFade) {
    let taskNoteElement = document.createElement('div');
    taskNoteElement.id = 'taskNote' + note.id;
    taskNoteElement.className = withFade ? 'OnlyOneNote ' : 'taskNoteDesign';

    let deleteIcon = document.createElement('i');
    deleteIcon.id = 'icon' + note.id;
    deleteIcon.className = 'fas fa-times';
    taskNoteElement.appendChild(deleteIcon);

    let taskOnNote = document.createElement('div');
    taskOnNote.className = 'taskOnNoteDesign font-weight-bold overflow-auto';
    taskNoteElement.appendChild(taskOnNote);
    taskOnNote.innerHTML = note.task;

    let dateOutput = document.createElement('div');
    dateOutput.className = 'dateOutput';
    taskNoteElement.appendChild(dateOutput);
    dateOutput.innerHTML = note.date;

    let timeOutput = document.createElement('div');
    timeOutput.className = 'timeOutput';
    taskNoteElement.appendChild(timeOutput);
    timeOutput.innerHTML = note.time;

    tasksAdded.appendChild(taskNoteElement);
    document.getElementById('icon' + note.id).addEventListener('click', deleteNote);

    if (withFade) {
        setTimeout(function () {
            taskNoteElement.style.opacity = '1';
        }, 0.5 * 1000);
    }
}

function addTask(e) {
    e.preventDefault();
    if (dateInput.value !== '' && taskInput.value != '') {
        let dateInputValue = new Date(dateInput.value);
        if (isDateValid(dateInputValue)) {
            dateInputValue = dayMonthYearFormat(dateInputValue);
            let noteObj = new note(taskInput.value, dateInputValue, timeInput.value);
            notesArray.push(noteObj);
            saveToLocalStorage();
            cleanForm();
            printTask(noteObj, true);
        } else {
            dateInput.value = '';
        }
    } else {
        alert("Date and Task must be filled.\nIf they're both filled, check if date is valid.");
    }
}

function isDateValid(selectedDate) {
    let now = new Date();
    now.setDate(now.getDate() - 1);
    if (selectedDate < now) {
        alert("Date must be in the future");
        return false;
    } else {
        return true;
    }
}

function dayMonthYearFormat(dateToFix) {
    dateToFix = ('0' + dateToFix.getDate()).slice(-2) + '/'
        + ('0' + (dateToFix.getMonth() + 1)).slice(-2) + '/'
        + dateToFix.getFullYear();
    return dateToFix;
}

function note(task, date, time) {
    this.id = idCounter++;
    this.task = task;
    this.date = date;
    this.time = time;
}

function saveToLocalStorage() {
    window.localStorage.setItem('task', JSON.stringify(notesArray));
    window.localStorage.setItem('lastIdCounter', idCounter);
}

function cleanForm() {
    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
}

function deleteNote() {
    let noteId = this.id;
    let id = Number(noteId.substring(4));
    let idx = getNoteIndex(id);
    notesArray.splice(idx, 1);
    saveToLocalStorage();
    let noteElement = document.getElementById('taskNote' + id);
    tasksAdded.removeChild(noteElement);
}

function getNoteIndex(id) {
    for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].id === id) {
            return i;
        }
    }
    return -1;
}