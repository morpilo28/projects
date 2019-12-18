/* TODO:
    - design
    - make adding an image (when adding a car) possible
    - needs to check for duplicate code
    - add C.R.U.D to token-bl   
    - add client (same as in leasing project but with mysql)
    - decide on when to make an input null if no input inside
*/

var app = {
    rowCounter: 0,
    endPointStart: `http://localhost:3201/`,
    END_POINTS: {
        vacations: 'vacations',
        login: 'login',
        register: 'register',
    },
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE',
        PUT: 'PUT'
    },
    TOKEN_LOCAL_STORAGE_KEY: 'token'
};

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
        case 'register':
            registerView();
            break;
        case 'login':
            loginView();
            break;
        case 'vacations':
            showCarTable();
            break;
        case 'logout':
            localStorage.removeItem(app.TOKEN_LOCAL_STORAGE_KEY);
            navigate('login');
            break;
    }
}

function showCarTable() {
    httpRequests(app.END_POINTS.vacations, app.METHODS.GET).then(res => tableView(res)).catch(status => {
        if (status === 500) {
            printToHtml('main', 'Internal Server Error');
        } else if (status === 401) {
            printToHtml('main', 'area for members only')
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

function tableView(carsArray, allCars) {
    let carsListLength = allCars ? allCars.length : carsArray.length;
    let addedCarId;
    if (allCars) {
        addedCarId = allCars[allCars.length - 1].id + 1;
    } else if (carsArray) {
        if (carsArray.length === 0) {
            addedCarId = 1;
        } else {
            addedCarId = carsArray[carsArray.length - 1].id + 1;
        }
    }
    let html = `
    <h3 id='tableNote'> </h3>
        <button id='add'>Add Car</button>
        <table class='myTable'>
            <thead>
                <tr>
                    <th>row</th>
                    <th>id</th>
                    <th>name</th>
                    <th>price</th>
                    <th>monthly</th>
                    <th>currency</th>
                    <th>doors</th>
                    <th>seats</th>
                    <th>image</th>
                    <th class='options'>options</th>
                </tr>
            </thead>
            <tbody id='carsTableBody'>
                <tr id='addCarRow' class="addCarRow">
                    <td class='addCarCells'><input disabled readonly/></td> 
                    <td class='addCarCells'>
                        <input id='addedCarId${addedCarId}' value='${addedCarId}' disabled readonly/>
                        <input id='addedCarId${addedCarId}' type='hidden' value='${addedCarId}'/>
                    </td>
                    <td class='addCarCells'><input type='text' id='name${addedCarId}' placeholder = 'name'></td>
                    <td class='addCarCells'><input type='number' min='0' id='price${addedCarId}' placeholder = 'price'></td>
                    <td class='addCarCells'><input type='number' min='0' id='monthly${addedCarId}' placeholder = 'monthly'></td>
                    <td class='addCarCells'><input type='text' id='currency${addedCarId}' placeholder = 'currency'></td>
                    <td class='addCarCells'><input type='number' min='0' id='doors${addedCarId}' placeholder = 'doors'></td>
                    <td class='addCarCells'><input type='number' min='0' id='seats${addedCarId}' placeholder = 'seats'></td>
                    <td class='addCarCells'><input type='text' id='image${addedCarId}' placeholder = 'image'></td>
                    <td class='addCarCells options'>
                        <button id='saveAddedCar' class='addBtns'>Save</button>
                        <button id='hideAddField' class='addBtns'>Hide</button>
                    </td>
                </tr>`;
    if (carsArray.length === 0) {
        printToHtml('main', html);
        printToHtml('tableNote', 'no cars has been found')
        addBtnEventListeners(carsArray, addedCarId, carsListLength);
    } else {
        for (let i = 0; i < carsArray.length && i < 10; i++) {
            const idx = carsArray[i].id;
            html += `
                <tr>
                    <td><b>${i + 1}</b>
                    <td><b>${idx}</b>
                        <input id='id${idx}' value='${idx}' type='hidden'/>
                    </td>
                    <td class='editable${idx}' id='name${idx}'>${carsArray[i].name}</td>
                    <td class='editable${idx}' id='price${idx}'>${carsArray[i].price}</td>
                    <td class='editable${idx}' id='monthly${idx}'>${carsArray[i].monthly}</td>
                    <td class='editable${idx}' id='currency${idx}'>${carsArray[i].currency}</td>
                    <td class='editable${idx}' id='doors${idx}'>${carsArray[i].doors}</td>
                    <td class='editable${idx}' id='seats${idx}'>${carsArray[i].seats}</td>
                    <td class='editable${idx}'><img id='image${idx}' width='50' src="./styles/images/${carsArray[i].image}" alt="${carsArray[i].image}"/></td>
                    <td id='buttonCell${idx}'>
                        <button id='edit${idx}' class='edit optionsBtn'>Edit</button>
                        <button id='delete${idx}' class='delete optionsBtn'>delete</button>
                        <button id='details${idx}' class='info optionsBtn'>More Details</button>
                    </td>
                </tr>`;
        }
        html += `
                    </tbody>
                </table>
                <button id='prev'>Prev</button>
                <button id='next'>Next</button>`;
        printToHtml('main', html);
        addBtnEventListeners(carsArray, addedCarId, carsListLength);
    }
}

function printToHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function addBtnEventListeners(carsArray, addedCarId, carsListLength) {
    document.getElementById('add').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: table-row');
    });

    document.getElementById('saveAddedCar').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: none');
        onSaveAddedCar(addedCarId);
    });

    document.getElementById('hideAddField').addEventListener('click', (e) => {
        e.preventDefault();
        jQuery('.addCarRow').attr('style', 'display: none');
    });

    jQuery('#prev').click((e) => {
        e.preventDefault();
        if (app.rowCounter >= 10) {
            app.rowCounter -= 10;
            httpRequests(app.END_POINTS.vacations + '/' + app.END_POINTS.prev + app.rowCounter, app.METHODS.GET).then((res) => {
                tableView(res.filteredCarData, res.allCarsList);
            }).catch(status => {
                console.log(status)
                if (status === 400) {
                    console.log(status);
                    alert('No previous cars!');
                } else {
                    console.log(status);
                }
            })
        } else {
            alert('No more cars to show!')
        }
    })

    jQuery('#next').click((e) => {
        e.preventDefault();
        app.rowCounter += 10;
        if (app.rowCounter < carsListLength) {
            httpRequests(app.END_POINTS.vacations + '/' + app.END_POINTS.next + app.rowCounter, app.METHODS.GET).then((res) => {
                tableView(res.filteredCarData, res.allCarsList);
            }).catch(status => {
                console.log(status);
                if (status === 400) {
                    console.log(status);
                    alert('No more cars to show!');
                } else {
                    console.log(status);
                }
            })
        } else {
            alert('No more cars to show!');
            app.rowCounter -= 10;
        }
    })

    for (let i = 0; i < carsArray.length; i++) {
        const id = carsArray[i].id;
        const singleCarEndPoint = `cars/${id}`;

        $(document).on('click', `#edit${id}`, (e) => {
            e.preventDefault();
            const idx = event.target.id.slice(4);
            onEditCar(idx, singleCarEndPoint);
        });

        $(document).on('click', `#delete${id}`, (e) => {
            e.preventDefault();
            const idx = { id: event.target.id.slice(6) };
            httpRequests(singleCarEndPoint, app.METHODS.DELETE, idx).then(res => {
                app.rowCounter = 0;
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
            httpRequests(singleCarEndPoint, app.METHODS.GET, null).then(res => onMoreDetails(res)).catch(status => {
                if (status === 500) {
                    printToHtml('main', 'Internal Server Error')
                } else {
                    console.log(status);
                }
            });;
        });
    }
}

function onSaveAddedCar(addedCarId) {
    const carToAdd = {
        id: document.getElementById(`addedCarId${addedCarId}`).value,
        name: document.getElementById(`name${addedCarId}`).value,
        price: document.getElementById(`price${addedCarId}`).value,
        monthly: document.getElementById(`monthly${addedCarId}`).value,
        currency: document.getElementById(`currency${addedCarId}`).value,
        doors: document.getElementById(`doors${addedCarId}`).value,
        seats: document.getElementById(`seats${addedCarId}`).value,
        image: document.getElementById(`image${addedCarId}`).value
    };
    let isEmpty = false;
    Object.values(carToAdd).forEach(value => {
        if (value === '') {
            isEmpty = true
        }
    });

    if (isEmpty === true) {
        printToHtml('tableNote', 'Please fill out all the fields!')
        jQuery('.addCarRow').attr('style', 'display: table-row');
    } else {
        httpRequests(app.END_POINTS.vacations, app.METHODS.POST, carToAdd).then(res => {
            app.rowCounter = 0;
            tableView(res);
        }).catch(status => {
            if (status === 500) {
                printToHtml('main', 'Internal Server Error')
            } else {
                console.log(status);
            }
        });
    }
}

function onEditCar(idx, singleCarEndPoint) {
    jQuery(`.editable${idx}`).attr('contenteditable', "true");
    jQuery(`#buttonCell${idx}`).empty().append(`
            <button id='saveChanges${idx}'>Save</button> <button id='cancelChanges${idx}'>Cancel</button>`);

    $(document).on('click', `#saveChanges${idx}`, (e) => {
        e.preventDefault();
        let editedObj = {
            name: jQuery(`#name${idx}`).html(),
            price: Number(jQuery(`#price${idx}`).html()),
            monthly: Number(jQuery(`#monthly${idx}`).html()),
            currency: jQuery(`#currency${idx}`).html(),
            doors: Number(jQuery(`#doors${idx}`).html()),
            seats: Number(jQuery(`#seats${idx}`).html()),
            image: jQuery(`#image${idx}`).attr('alt')
        };

        let isDataTypeGood = true;
        for (let key in editedObj) {
            if (key === 'price' || key === 'monthly' || key === 'doors' || key === 'seats') {
                if (isNaN(editedObj[key]) || editedObj[key] === 0) {
                    isDataTypeGood = false;
                }
            }
        }
        if (isDataTypeGood === false) {
            printToHtml('tableNote', "The fields 'price', 'monthly', 'doors' and 'seats' must be field with numbers and larger than 0.")
        } else {
            httpRequests(singleCarEndPoint, app.METHODS.PUT, editedObj).then(res => {
                app.rowCounter = 0;
                changeBackToOriginalBtn(res.newUpdatedCarId);
                tableView(res.allCars);
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
        app.rowCounter = 0;
        showCarTable();
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
            <img width='200' src="./styles/images/${res.singleCarData.image}" alt="${res.singleCarData.image}"/>
            <br><br>
            name: ${res.singleCarData.name}
            <br><br>
            price: ${res.singleCarData.price}
            <br><br>
            monthly: ${res.singleCarData.monthly}
            <br><br>
            currency: ${res.singleCarData.currency}
            <br><br>
            doors: ${res.singleCarData.doors}
            <br><br>
            seats: ${res.singleCarData.seats}
            <br><br>
            <button id='returnToFullList'>Return To Full List</button>
            </div>
            `
    printToHtml('main', html);

    document.getElementById('returnToFullList').addEventListener('click', (e) => {
        e.preventDefault();
        app.rowCounter = 0;
        tableView(res.allCars);
    })
}

function registerView(note) {
    //TODO: make id and isAdmin inputs not accessible to user.
    note = note ? note : '';
    const html = `
    <h2>Register</h2>
    <p>${note}</p>
    <div>
        <label>Id: <input id='userId'></label>
        <label>First Name: <input id='firstName'></label>
        <label>Last Name: <input id='lastName'></label>
        <label>User Name: <input id='userName'></label>
        <label>Password: <input id='password' type='password'></label>
        <label>Is Admin: <input id='isAdmin'></label>
        <button id='register'>Register</button>
    </div>
    `
    printToHtml('main', html);
    document.getElementById('register').addEventListener('click', register);
}

function register() {
    const params = {
        id: document.getElementById('userId').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value,
        isAdmin: document.getElementById('isAdmin').value,
    };

    httpRequests(app.END_POINTS.register, app.METHODS.POST, params).then(res => {
        const idArray = ['userId', 'firstName', 'lastName', 'userName', 'password', 'isAdmin']
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
    note = note ? note : '';
    const html = `
    <div>
    <h2>Login</h2>
    <p>${note}</p>
        <label>User Name: <input id='userName'></label>
        <label>Password: <input id='password' type='password'></label>
        <button id='login'>Login</button>
    </div>
    `
    printToHtml('main', html);
    document.getElementById('login').addEventListener('click', loginValidation);
}

function loginValidation() {
    const params = {
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };
    httpRequests(app.END_POINTS.login, app.METHODS.POST, params).then(token => {
        emptyInputs('userName');
        emptyInputs('password');
        localStorage.setItem(app.TOKEN_LOCAL_STORAGE_KEY, token);
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