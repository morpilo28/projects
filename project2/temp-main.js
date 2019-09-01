function onSearch() {
    app.isShowSelectedCoinsPage = false;
    $(`.cardBody`).css({ 'display': 'none' });
    let searchArray = [];
    for (let i = 0; i < app.newResultArray.length; i++) {
        if ($(`#myToggle${i}`).attr('data-coin-name') == $('#search').val()) {
            searchArray.push($(`#cardBody${i}`)[0].id);
        }
    }
    $('#search').val("");
    displayCoinCards(searchArray); 
}

function onShowSelectedCoinsButton() {
    app.isShowSelectedCoinsPage = true;
    $(`.cardBody`).css({ 'display': 'none' });
    let showSelectedCoinsArray = [];
    for (let i = 0; i < app.newResultArray.length; i++) {
        if ($(`#myToggle${i}`).prop('checked')) {
            showSelectedCoinsArray.push($(`#cardBody${i}`)[0].id);
        }
    }
    displayCoinCards(showSelectedCoinsArray); 
}

function displayCoinCards(coinsArrayToDisplay) {
    if (coinsArrayToDisplay.length !== 0) {
        for (let i = 0; i < coinsArrayToDisplay.length; i++) {
            $(`#${coinsArrayToDisplay[i]}`).css({ 'display': 'block' });
        }
    } else {
        alert('no coins found');
        $(`.cardBody`).css({ 'display': 'block' });
        app.isShowSelectedCoinsPage = false;
    }
}

function showChosenCoinsOrSearch(showOrSearch) {
    app.isShowSelectedCoinsPage = false;
    $(`.cardBody`).css({ 'display': 'none' });
    let showOrSearchArray = [];
    for (let i = 0; i < app.newResultArray.length; i++) {
        if (showOrSearch == 'show') {
            if ($(`#myToggle${i}`).prop('checked')) {
                showOrSearchArray.push($(`#cardBody${i}`));
            }
        } else if (showOrSearch = 'search') {
            app.isShowSelectedCoinsPage = true;
            if ($(`#myToggle${i}`).attr('data-coin-name') == $('#search').val()) {
                showOrSearchArray.push($(`#cardBody${i}`));
            }
        }
    }
    if (showOrSearchArray.length !== 0) {
        for (let i = 0; i < showOrSearchArray.length; i++) {
            $('#search').val("");
            $('#' + ((showOrSearchArray[i])[0].id)).css({ 'display': 'block' });
        }
    } else {
        $('#search').val("");
        alert('no coins found');
        $(`.cardBody`).css({ 'display': 'block' });
        app.isShowSelectedCoinsPage = true;
    }
}