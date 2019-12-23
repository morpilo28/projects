/* TODO:
    - design
    - make adding an image (when adding a vacation) possible
    - needs to check for duplicate code
    - change lower case to upper case or vice versa if needed (for example in: registration/login, adding/updating a vacation, etc.)
    - add the charts section
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
    clickOnFollow: 0
};

if (!window.localStorage.getItem('userNameForTitle')) {
    loginView();
} else {
    showVacationTable();
}

navbarEventListeners();

function navbarEventListeners(e) {
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
    httpRequests(app.END_POINTS.vacations, app.METHODS.GET).then(res => tableView(res)).catch(status => {
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

function tableView(vacationsArray, allVacations) {
    showUserName();
    if (window.localStorage.getItem('isAdmin') === 'true') {
        adminView(allVacations, vacationsArray)
    } else {
        clientView(vacationsArray);
    }
}

function printToHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function addBtnEventListeners(vacationsArray, addedVacationId) {
    document.getElementById('add').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addRow').attr('style', 'display: table-row');
    });

    document.getElementById('saveAddedVacation').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addRow').attr('style', 'display: none');
        onSaveAddedVacation(addedVacationId);
    });

    document.getElementById('hideAddField').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addRow').attr('style', 'display: none');
    });

    for (let i = 0; i < vacationsArray.length; i++) {
        const id = vacationsArray[i].id;
        const singleVacationEndPoint = `vacations/${id}`;

        $(document).on('click', `#edit${id}`, (e) => {
            e.preventDefault();
            const idx = event.target.id.slice(4);
            onEditVacation(idx, singleVacationEndPoint);
        });

        $(document).on('click', `#delete${id}`, (e) => {
            e.preventDefault();
            const idx = { id: event.target.id.slice(6) };
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

        $(document).on('click', `#details${id}`, (e) => {
            e.preventDefault();
            httpRequests(singleVacationEndPoint, app.METHODS.GET, null).then(res => onMoreDetails(res)).catch(status => {
                if (status === 500) {
                    printToHtml('main', 'Internal Server Error')
                } else {
                    console.log(status);
                }
            });;
        });
    }
}

function onSaveAddedVacation(addedVacationId) {
    const vacationToAdd = {
        id: document.getElementById(`addedId${addedVacationId}`).value,
        destination: document.getElementById(`destination${addedVacationId}`).value,
        description: document.getElementById(`description${addedVacationId}`).value,
        image: document.getElementById(`image${addedVacationId}`).value,
        fromDate: document.getElementById(`fromDate${addedVacationId}`).value,
        toDate: document.getElementById(`toDate${addedVacationId}`).value,
        price: document.getElementById(`price${addedVacationId}`).value,
        followers: 0
    };
    let isEmpty = false;
    Object.values(vacationToAdd).forEach(value => {
        if (value === '') {
            isEmpty = true
        }
    });

    if (isEmpty === true) {
        printToHtml('tableNote', 'Please fill out all the fields!')
        jQuery('.addRow').attr('style', 'display: table-row');
    } else {
        httpRequests(app.END_POINTS.vacations, app.METHODS.POST, vacationToAdd).then(res => {
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

function onEditVacation(idx, singleVacationEndPoint) {
    jQuery(`.editable${idx}`).attr('contenteditable', "true");
    jQuery(`#buttonCell${idx}`).empty().append(`
            <button id='saveChanges${idx}'>Save</button> <button id='cancelChanges${idx}'>Cancel</button>`);

    $(document).on('click', `#saveChanges${idx}`, (e) => {
        e.preventDefault();
        let editedObj = {
            destination: jQuery(`#destination${idx}`).html(),
            description: jQuery(`#description${idx}`).html(),
            image: jQuery(`#image${idx}`).attr('alt'),
            fromDate: jQuery(`#fromDate${idx}`).html(),
            toDate: jQuery(`#toDate${idx}`).html(),
            price: Number(jQuery(`#price${idx}`).html()),
            followers: 0 //TODO: num of followers at adding must be 0?!
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
            printToHtml('tableNote', "The field 'price' must be field with numbers and larger than 0.");
        } else {
            httpRequests(singleVacationEndPoint, app.METHODS.PUT, editedObj).then(res => {
                changeBackToOriginalBtn(res.newUpdatedVacationId);
                tableView(res.allVacations);
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

function changeBackToOriginalBtn(idx) {
    // TODO: when two rows or more are switched, the switching back occurs on all of them (instead of on only one)
    jQuery(`#buttonCell${idx}`).empty().append(`<button id='edit${idx}' class='edit'>Edit</button>
                <button id='delete${idx}' class='delete'>delete</button>
                <button id='details${idx}' class='info'>More Details</button>`);
    jQuery(`.editable${idx}`).attr('contenteditable', "false");
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
    //TODO: insert values to id and isAdmin and make their inputs not accessible to user.
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

function clientView(vacationsArray) {
    //TODO: instead of table show each vacation on different card (div)
    if (vacationsArray.length === 0) {
        document.getElementById('main').innerHTML = 'No vacations have been found!';
    } else {
        let html;
        for (let i = 0; i < vacationsArray.length; i++) {
            html += `
                <div class='card'>
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
                    <button id='followBtn${vacationsArray[i].id}' class="btn btn-success btn-circle btn-circle-sm m-1">f</button>
                </div>`;
        }

        document.getElementById('main').innerHTML = html;
        for (let i = 0; i < vacationsArray.length; i++) {
            document.getElementById(`followBtn${vacationsArray[i].id}`).addEventListener('click', (e) => {
                e.preventDefault();
                const vacationId = e.target.id.slice(9);
                //TODO: add a condition to differentiate between a pressed btn to follow to pressed one to unfollow
                //if pressed to follow then
                updateFollowersCount(vacationsArray, vacationId);
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
    app.clickOnFollow += 1;
    //make btn background color yellow
    httpRequests(app.END_POINTS.follow, app.METHODS.POST, followObjToAdd).then(res => {
        console.log(res);
    }).catch(status => {
        if (status === 400) {
            alert('vacation already been followed');
        }
        else {
            console.log(status);
        }
    });
}

function updateFollowersCount(vacationsArray, vacationId) {
    let index = vacationsArray.findIndex(vacation => vacation.id == vacationId);
    vacationsArray[index].followers += 1;
    const vacationToUpdateFollowers = vacationsArray[index];
    httpRequests(app.END_POINTS.vacations + '/' + vacationId, app.METHODS.PUT, vacationToUpdateFollowers).then(res => {
        console.log(res);
    }).catch(status => {
        console.log(status);
    });
}

function adminView(allVacations, vacationsArray) {
    //TODO: instead of table show each vacation on different card (div)
    let vacationsListLength = allVacations ? allVacations.length : vacationsArray.length;
    let addedVacationId;
    if (allVacations) {
        addedVacationId = allVacations[allVacations.length - 1].id + 1;
    } else if (vacationsArray) {
        if (vacationsArray.length === 0) {
            addedVacationId = 1;
        }
        else {
            addedVacationId = vacationsArray[vacationsArray.length - 1].id + 1;
        }
    }
    //TODO: consider using form
    let html = `
    <h3 id='tableNote'> </h3>
        <button id='add'>Add Vacation</button>
        <table class='myTable'>
            <thead>
                <tr>
                    <th>row</th>
                    <th>id</th>
                    <th>destination</th>
                    <th>description</th>
                    <th>image</th>
                    <th>from</th>
                    <th>to</th>
                    <th>price</th>
                    <th class='options'>options</th>
                </tr>
            </thead>
            <tbody id='vacationsTableBody'>
                <tr id='addRow' class="addRow">
                    <td class='addCells'><input disabled readonly/></td> 
                    <td class='addCells'>
                        <input id='addedId${addedVacationId}' value='${addedVacationId}' disabled readonly/>
                        <input id='addedId${addedVacationId}' type='hidden' value='${addedVacationId}'/>
                    </td>
                    <td class='addCells'><input required type='text' id='destination${addedVacationId}' placeholder = 'destination'></td>
                    <td class='addCells'><input required type='text' id='description${addedVacationId}' placeholder = 'description'></td>
                    <td class='addCells'><input required type='text' id='image${addedVacationId}' placeholder = 'image'></td>
                    <td class='addCells'><input required type='date' id='fromDate${addedVacationId}' placeholder = 'from'></td>
                    <td class='addCells'><input required type='date' id='toDate${addedVacationId}' placeholder = 'to'></td>
                    <td class='addCells'><input required type='number' min='0' id='price${addedVacationId}' placeholder = 'price'></td>
                    <td class='addCells options'>
                        <button id='saveAddedVacation' class='addBtns'>Save</button>
                        <button id='hideAddField' class='addBtns'>Hide</button>
                    </td>
                </tr>`;
    if (vacationsArray.length === 0) {
        printToHtml('main', html);
        printToHtml('tableNote', 'no vacations has been found');
        addBtnEventListeners(vacationsArray, addedVacationId, vacationsListLength);
    }
    else {
        for (let i = 0; i < vacationsArray.length; i++) {
            const idx = vacationsArray[i].id;
            html += `
                <tr>
                    <td><b>${i + 1}</b>
                    <td><b>${idx}</b>
                        <input id='id${idx}' value='${idx}' type='hidden'/>
                    </td>
                    <td class='editable${idx}' id='destination${idx}'>${vacationsArray[i].destination}</td>
                    <td class='editable${idx}' id='description${idx}'>${vacationsArray[i].description}</td>
                    <td class='editable${idx}'><img id='image${idx}' width='80' src="./styles/images/${vacationsArray[i].image}" alt="${vacationsArray[i].image}"/></td>
                    <td class='editable${idx}' id='fromDate${idx}'>${vacationsArray[i].fromDate}</td>
                    <td class='editable${idx}' id='toDate${idx}'>${vacationsArray[i].toDate}</td>
                    <td class='editable${idx}' id='price${idx}'>${vacationsArray[i].price}</td>
                    <td id='buttonCell${idx}'>
                        <button id='edit${idx}' class='edit optionsBtn'>Edit</button>
                        <button id='delete${idx}' class='delete optionsBtn'>delete</button>
                        <button id='details${idx}' class='info optionsBtn'>More Details</button>
                    </td>
                </tr>`;
        }
        html += `
                    </tbody>
                </table>`;
        printToHtml('main', html);
        addBtnEventListeners(vacationsArray, addedVacationId, vacationsListLength);
    }
}
