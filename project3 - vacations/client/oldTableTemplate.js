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
    <div id='vacationList'></div>`

    if (vacationsArray.length === 0) {
        printToHtml('main', html);
        printToHtml('tableNote', 'no vacations has been found');
        addBtnEventListeners(vacationsArray, addedVacationId, vacationsListLength);
    }
    else {
        for (let i = 0; i < vacationsArray.length; i++) {
            const idx = vacationsArray[i].id;
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
            </div>`;
            html += `
                    <button id='edit${idx}' class='edit optionsBtn'>Edit</button>
                    <button id='delete${idx}' class='delete optionsBtn'>delete</button>
                    <button id='details${idx}' class='info optionsBtn'>More Details</button>`;
        }
        printToHtml('main', html);
        addBtnEventListeners(vacationsArray, addedVacationId, vacationsListLength);
    }
}

function addView() {
    `<tbody id='vacationsTableBody'>
        <tr id='addRow' class="addRow">
            <td class='addCells'><input disabled readonly /></td>
            <td class='addCells'>
                <input id='addedId${addedVacationId}' value='${addedVacationId}' disabled readonly />
                <input id='addedId${addedVacationId}' type='hidden' value='${addedVacationId}' />
            </td>
            <td class='addCells'><input required type='text' id='destination${addedVacationId}' placeholder='destination'></td>
                <td class='addCells'><input required type='text' id='description${addedVacationId}' placeholder='description'></td>
                    <td class='addCells'><input required type='text' id='image${addedVacationId}' placeholder='image'></td>
                        <td class='addCells'><input required type='date' id='fromDate${addedVacationId}' placeholder='from'></td>
                            <td class='addCells'><input required type='date' id='toDate${addedVacationId}' placeholder='to'></td>
                                <td class='addCells'><input required type='number' min='0' id='price${addedVacationId}' placeholder='price'></td>
                                    <td class='addCells options'>
                                        <button id='saveAddedVacation' class='addBtns'>Save</button>
                                        <button id='hideAddField' class='addBtns'>Hide</button>
                                    </td>
                </tr>`;
}

function oldAdminView(allVacations, vacationsArray) {
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
