"use strict";
/* problems:
        - problem with the modal!!!! opens up multiple modals and then the id's are not unique!!!
        - fix problems with date (on adding and editing);
        - is there any place to use /vacation/:id?!
    TODO:
    - add the charts section
    - change lower case to upper case or vice versa if needed (for example in: registration/login, adding/updating a vacation, etc.)
    - make adding an image (when adding a vacation) possible
    - show list ordered by vacation followed by user first.
    - design
    - needs to check for duplicate code
*/
var app = {
    endPointStart: `http://localhost:3201/`,
    END_POINTS: {
        vacations: 'vacations',
        login: 'login',
        register: 'register',
        follow: 'follow'
    },
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE',
        PUT: 'PUT'
    },
    TOKEN_LOCAL_STORAGE_KEY: 'token',
};

if (!window.localStorage.getItem('userNameForTitle')) {
    loginView();
} else {
    showVacationTable();
}

navbarEventListeners();

function navbarEventListeners() {
    const links = document.querySelectorAll('#nav a[data-href]');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.target.dataset.href);
        })
    }
}

function navigate(url) {
    printToHtml('main', '');
    switch (url) {
        case 'login':
            loginView();
            break;
        case 'vacations':
            showVacationTable();
            break;
        case 'logout':
            window.localStorage.clear();
            navigate('login');
            break;
    }
}

function showVacationTable() {
    const userId = window.localStorage.getItem('userId');
    httpRequests(app.END_POINTS.vacations + '?userId=' + userId, app.METHODS.GET).then(res => tableView(res)).catch(status => {
        if (status === 500) {
            printToHtml('main', 'Internal Server Error');
        } else if (status === 401) {
            printToHtml('main', 'Area for members only! Please Login to show the list');
        } else {
            console.log(status);
        }
    });
}

function httpRequests(endPoint, httpVerb, reqBody) {
    return new Promise((resolve, reject) => {
        const headers = { 'Content-Type': 'application/json' }
        if (localStorage.getItem(app.TOKEN_LOCAL_STORAGE_KEY)) {
            headers['Authorization'] = 'bearer ' + localStorage.getItem(app.TOKEN_LOCAL_STORAGE_KEY);
        }

        const fetchOptions = {
            method: httpVerb,
            headers: headers,
        }

        if (httpVerb === app.METHODS.DELETE || httpVerb === app.METHODS.POST || httpVerb === app.METHODS.PUT && reqBody) {
            fetchOptions['body'] = JSON.stringify(reqBody);
        }

        fetch(app.endPointStart + endPoint, fetchOptions).then(responseData => {
            let dataType = responseData.headers.get('content-type');
            if (responseData.status !== 200) {
                reject(responseData.status);
            }
            //TODO: what happens when dataType is null (admin.js:264 Uncaught (in promise) TypeError: Cannot read property 'indexOf' of null)
            //TODO: check if this next statement is suitable to address the problem of null data type
            dataType = !dataType ? 'text/html; charset=utf-8' : dataType;
            if (dataType.indexOf('json') > -1) {
                responseData.json().then(res => resolve(res));
            } else if (dataType.indexOf('text') > -1) {
                responseData.text().then(res => resolve(res));
            } else {
                console.log('no match');
            }
        });
    })
}

function tableView(vacations, allVacations) {
    showUserName();
    if (window.localStorage.getItem('isAdmin') === 'true') {
        adminView(allVacations, vacations)
    } else {
        clientView(vacations);
    }
}

function printToHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function addBtnEventListeners(vacationsArray) {
    $(document).on('click', '#add', (e) => {
        e.preventDefault();
        paintModalElement('save');
    });

    $(document).on('click', `#save`, (e) => {
        e.preventDefault();
        onSaveAddedVacation();
    });

    $(document).on('click', `#close`, (e) => {
        e.preventDefault();
        closeModal();
    });

    for (let i = 0; i < vacationsArray.length; i++) {
        const id = vacationsArray[i].id;
        const singleVacationEndPoint = `vacations/${id}`;
        $(document).on('click', `#editIcon${id}`, { value: i }, (e) => {
            e.preventDefault();
            const id = event.target.id.slice(8);
            const objToUpdate = vacationsArray[i];
            paintModalElement(`saveChanges${id}`, objToUpdate);
            onEditVacation(id, singleVacationEndPoint, objToUpdate.followers);
        });

        $(document).on('click', `#deleteIcon${id}`, (e) => {
            e.preventDefault();
            const idx = { id: event.target.id.slice(10) };
            httpRequests(singleVacationEndPoint, app.METHODS.DELETE, idx).then(res => {
                tableView(res);
            }).catch(status => {
                if (status === 500) {
                    printToHtml('main', 'Internal Server Error')
                } else {
                    console.log(status);
                }
            });
        });
    }
}

function onSaveAddedVacation() {
    const vacationToAdd = {
        destination: document.getElementById(`addedDestination`).value,
        description: document.getElementById(`addedDescription`).value,
        image: document.getElementById(`addedImage`).value,
        fromDate: document.getElementById(`addedFromDate`).value,
        toDate: document.getElementById(`addedToDate`).value,
        price: document.getElementById(`addedPrice`).value,
        followers: 0
    };
    let isEmpty = false;
    Object.values(vacationToAdd).forEach(value => {
        if (value === '') {
            isEmpty = true
        }
    });

    if (isEmpty === true) {
        printToHtml('modalHeader', "Can't save before filling out all the fields!")
    } else {
        httpRequests(app.END_POINTS.vacations, app.METHODS.POST, vacationToAdd).then(res => {
            closeModal();
            tableView(res);
        }).catch(status => {
            if (status === 500) {
                printToHtml('main', 'Internal Server Error')
            } else if (status === 400) {
                printToHtml('main', 'The added vacation already exist.')
            } else {
                console.log(status);
            }
        });
    }
}

function onEditVacation(idx, singleVacationEndPoint, followers) {
    $(document).on('click', `#saveChanges${idx}`, (e) => {
        e.preventDefault();
        let editedObj = {
            destination: jQuery(`#editDestination`).val(),
            description: jQuery(`#editDescription`).val(),
            image: jQuery(`#editImage`).val(),
            fromDate: jQuery(`#editFromDate`).val(),
            toDate: jQuery(`#editToDate`).val(),
            price: Number(jQuery(`#editPrice`).val()),
            followers: followers
        };

        let isDataTypeGood = true;
        for (let key in editedObj) {
            if (key === 'price') {
                if (isNaN(editedObj[key]) || editedObj[key] === 0) {
                    isDataTypeGood = false;
                }
            }
        }
        if (isDataTypeGood === false) {
            printToHtml('modalHeader', "The field 'price' must be field with numbers and larger than 0.");
        } else {
            httpRequests(singleVacationEndPoint, app.METHODS.PUT, editedObj).then(res => {
                closeModal();
                tableView(res);
            }).catch(status => {
                if (status === 500) {

                } else {
                    console.log(status);
                }
            });
        }
    });

    $(document).on('click', `#cancelChanges${idx}`, (e) => {
        e.preventDefault();
        changeBackToOriginalBtn(idx);
        showVacationTable();
    });
}

function onMoreDetails(res) {
    let html = `
            <div>
                <img width='200' src="./styles/images/${res.singleVacationData.image}" alt="${res.singleVacationData.image}"/>
                <br><br>
                description: ${res.singleVacationData.description}
                <br><br>
                destination: ${res.singleVacationData.destination}
                <br><br>
                from: ${res.singleVacationData.fromDate}
                <br><br>
                To: ${res.singleVacationData.toDate}
                <br><br>
                price: ${res.singleVacationData.price}
                <br><br>
                <button id='returnToFullList'>Return To Full List</button>
            </div>
            `
    printToHtml('main', html);

    document.getElementById('returnToFullList').addEventListener('click', (e) => {
        e.preventDefault();
        tableView(res.allVacations);
    })
}

function registerView(note) {
    note = note ? note : '';
    const html = `
    <h2>Register</h2>
    <p>${note}</p>
    <div>
        <label>First Name: <input id='firstName'></label>
        <label>Last Name: <input id='lastName'></label>
        <label>User Name: <input id='userName'></label>
        <label>Password: <input id='password' type='password'></label>
        <div>  
            <button id='register'>Register</button>
        </div>
    </div>
    `
    printToHtml('main', html);
    document.getElementById('register').addEventListener('click', register);
}

function register() {
    const params = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value,
        isAdmin: 'false',
    };

    httpRequests(app.END_POINTS.register, app.METHODS.POST, params).then(res => {
        const idArray = ['firstName', 'lastName', 'userName', 'password']
        for (let i = 0; i < idArray.length; i++) {
            emptyInputs(idArray[i]);
        }
        registerView('registration succeeded');
    }).catch(status => {
        console.log(status);
        if (status === 400) {
            registerView('user name taken. please select a different name');
        } else {
            console.log(status);
        }
    });
}

function loginView(note) {
    showUserName();
    note = note ? note : '';
    const html = `
    <div>
    <h2>Login</h2>
    <p>${note}</p>
        <label>User Name: <input id='userName'></label>
        <label>Password: <input id='password' type='password'></label>
        <button id='login'>Login</button>
        <p><u>Not yet a member? <a id='register' href='register'>Register Here!</u></a>
    </div>
    `
    printToHtml('main', html);
    document.getElementById('register').addEventListener('click', (e) => {
        e.preventDefault();
        registerView();
    });
    document.getElementById('login').addEventListener('click', loginValidation);
}

function showUserName() {
    const savedUserName = window.localStorage.getItem('userNameForTitle');
    if (!savedUserName) {
        document.getElementById('userNameForTitle').innerHTML = `Hello Guest,`;
    }
    else {
        document.getElementById('userNameForTitle').innerHTML = `Hello ${(savedUserName).charAt(0).toUpperCase() + savedUserName.slice(1)},`;
    }
}

function loginValidation() {
    const params = {
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };
    httpRequests(app.END_POINTS.login, app.METHODS.POST, params).then(res => {
        emptyInputs('userName');
        emptyInputs('password');
        window.localStorage.setItem(app.TOKEN_LOCAL_STORAGE_KEY, res.token);
        window.localStorage.setItem('userNameForTitle', res.userName);
        window.localStorage.setItem('userId', res.userId);
        window.localStorage.setItem('isAdmin', res.isAdmin);
        navigate('vacations');
    }).catch(status => {
        console.log(status);
        if (status === 400) {
            loginView('User Not Found');
        } else {
            console.log(status);
        }
    })
}

function emptyInputs(id) {
    document.getElementById(id).value = '';
}

function clientView(vacations) {
    let allVacations = vacations.organizedVacationArray;
    let followedVacations = vacations.userFollowedVacationsIds;

    if (allVacations.length === 0) {
        document.getElementById('main').innerHTML = 'No vacations have been found!';
    } else {
        let html = `<div>`;
        let isFollowed = 'unFollowBtnColor';
        for (let i = 0; i < allVacations.length; i++) {
            for (let j = 0; j < followedVacations.length; j++) {
                isFollowed = 'unFollowBtnColor';
                if (followedVacations[j] === allVacations[i].id) {
                    isFollowed = 'followBtnColor';
                    break;
                }
            }

            html += `
                <div class='card'>
                    <div><b>${allVacations[i].destination}</b></div>
                    <div>${allVacations[i].description}</div>
                    <div>${allVacations[i].price}$</div>
                    <div>
                        <img width='80' src="./styles/images/${allVacations[i].image}" alt="${allVacations[i].image}"/>
                    </div>
                    <div>
                        <p>From: ${allVacations[i].fromDate}</p>
                        <p>To: ${allVacations[i].toDate}</p>
                    </div>
                    <button id='followBtn${allVacations[i].id}' class="btn btn-success btn-circle btn-circle-sm m-1 ${isFollowed}">f</button>
                </div>`;
        }
        html += `</div>`;
        document.getElementById('main').innerHTML = html;

        for (let i = 0; i < allVacations.length; i++) {
            document.getElementById(`followBtn${allVacations[i].id}`).addEventListener('click', (e) => {
                e.preventDefault();
                const vacationId = e.target.id.slice(9);
                //TODO: cancel the green color after pressed btn;

                /*  */
                addToFollowDb(vacationId);
                //else if pressed to unfollow then
            })
        }
    }
}

function addToFollowDb(vacationId) {
    const followObjToAdd = {
        userId: window.localStorage.getItem('userId'),
        vacationId: vacationId
    };
    //TODO: make btn background color yellow
    httpRequests(app.END_POINTS.follow, app.METHODS.POST, followObjToAdd).then(res => {
        //get back vacation id and then change btn color if unFollowed
        console.log(res);
        if (res.isFollowed === true) {
            $(`#followBtn${res.vacationId}`).toggleClass('unFollowBtnColor followBtnColor');
            debugger
            updateFollowersCount(res.vacationId, 'add');
        } else {
            $(`#followBtn${res.vacationId}`).toggleClass('followBtnColor unFollowBtnColor');
            updateFollowersCount(res.vacationId, 'reduce');
        }
    }).catch(status => {
        if (status === 400) {
            alert('vacation already been followed');
        }
        else {
            console.log(status);
        }
    });
}

function updateFollowersCount(vacationId, reduceOrAdd) {
    debugger
    const reqBody = {
        userId: window.localStorage.getItem('userId'),
        id: vacationId,
        reduceOrAdd: reduceOrAdd
    }
    httpRequests(app.END_POINTS.vacations + '/' + vacationId, app.METHODS.PUT, reqBody).then(res => {
        console.log(res);
    }).catch(status => {
        console.log(status);
    });
}

function adminView(allVacations, vacationsArray) {
    let html = `
    <h3 id='vacationListNote'> </h3>
    <div id='modalElement'></div>
    <button id='add'>Add Vacation</button>
    <div id='vacationList'>`

    if (vacationsArray.length === 0) {
        printToHtml('main', html);
        printToHtml('vacationListNote', 'no vacations has been found');
        addBtnEventListeners(vacationsArray);
    }
    else {
        for (let i = 0; i < vacationsArray.length; i++) {
            const idx = vacationsArray[i].id;
            html += `
            <div class='card'>
                <i id='deleteIcon${idx}' class='fas fa-times'></i>
                <i id='editIcon${idx}' class="fas fa-pencil-alt"></i>
                <input hidden value='${idx}'/>
                <div><b>${vacationsArray[i].destination}</b></div>
                <div>${vacationsArray[i].description}</div>
                <div>${vacationsArray[i].price}$</div>
                <div>
                    <img width='80' src="./styles/images/${vacationsArray[i].image}" alt="${vacationsArray[i].image}"/>
                </div>
                <div>
                    <p>From: ${vacationsArray[i].fromDate}</p>
                    <p>To: ${vacationsArray[i].toDate}</p>
                </div>
            </div>`;
        }
        html += `</div>`;
        printToHtml('main', html);
        addBtnEventListeners(vacationsArray);
    }
}

function paintModalElement(saveId, objToUpdate) {
    //TODO: problem with the modal!!!! opens up multiple modals and then the id's are not unique!!!
    let modalBody = `<div class="modal-body">`;
    if (objToUpdate) {
        modalBody = modalBodyForUpdate(modalBody, objToUpdate);
    } else {
        modalBody = modalBodyForAdd(modalBody);
    }
    $('#modalElement').append(`  
        <div id="myModal" class="modal" role="dialog">
            <div class="modal-dialog modal-sm">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 id='modalHeader' class="modal-title">Please fill out all the fields</h4>
                        </div>
                        ${modalBody}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="closeBtn btn btn-default" id='${saveId}'>Save</button>
                            <button type="button" class="closeBtn btn btn-default"  id='close'>Close</button>
                        </div>
                </div>
            </div>
        </div>`)
    displayVacationModal();
};

function modalBodyForAdd(modalBody) {
    modalBody += `
        <label>Destination: <input id='addedDestination' required type='text'></label><br>
        <label>Description: <input id='addedDescription' required type='text'></label><br>
        <label>Image: <input id='addedImage' required type='text'></label><br>
        <label>From: <input id='addedFromDate' required type='date'></label><br>
        <label>To: <input id='addedToDate' required type='date'></label><br>
        <label>Price: <input id='addedPrice' required type='number' min='0'></label><br>
        `;
    return modalBody;
}

function modalBodyForUpdate(modalBody, objToUpdate) {
    modalBody += `
        <label>Destination: <input id='editDestination' required type='text' value='${objToUpdate.destination}'></label><br>
        <label>Description: <input id='editDescription' required type='text' value='${objToUpdate.description}'></label><br>
        <label>Image: <input id='editImage' required type='text' value='${objToUpdate.image}'></label><br>
        <label>From: <input id='editFromDate' required type='date' value='${objToUpdate.fromDate}'></label><br>
        <label>To: <input id='editToDate' required type='date' value='${objToUpdate.toDate}'></label><br>
        <label>Price: <input id='editPrice' required type='number' min='0' value='${objToUpdate.price}'></label><br>
        `;
    return modalBody;
}

function closeModal() {
    $('#myModal').modal('hide');
    $('#modalElement').empty();
    /* $("#myModal").on('hidden.bs.modal', function (e) {
        e.preventDefault();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('#myModal').remove();
    }); */
    /*  $("#myModal").on('hidden.bs.modal', () => {
         $(this).data('bs.modal', null);
     }); */
}

function displayVacationModal() {
    $('#myModal').modal('show');
    /*  $('#myModal').modal({
         backdrop: 'static',
         keyboard: false
     }); */
}
