/* ----- updated - 18.08.19 20:38 -----
1. needs to continue from p.6 - save to local storage.
2. needs to fix disabling of toggle switch when remove and replace from array
3. needs to adjust for mobile
4.check for duplicate code and arrange everything
*/
"use strict";
jQuery.noConflict();
const app = {
    PURGE_IN_SECONDS: 120,
    newResultArray: [],
    numOfSecondsPast: 0,
    countSelectedCoins: 0,
    selectedCoinsArray: [],
};

function main() {
    homePage();
    addModalElement();
    jQuery("#home").click(homePage);
    jQuery("#liveReports").click(liveReportsPage);
    jQuery("#about").click(aboutPage);
}

function homePage() { //creating the home page
    jQuery('#currentPage').empty().append('<div id="row"></div>');
    getAllCoins();
}

function liveReportsPage() { //creating the live reports page
    jQuery('#currentPage').empty();
}

function aboutPage() { //creating the about page
    jQuery('#currentPage').empty().append(`<div> <p> <span> <u> About Myself </u> </span> <br>
    <img width = 152 height = 202 opacity=1 src = styles/images/mor.jpg> </img> <br> <br>
    <span> My name is Mor. <br> I'm 28 years old.<br> I came to lear fullstack so i could fine a 
    decent job but i don't know if it's going to happend. </span> <br> </p> <br>
    <p> <span> <u> The Project </u> <br> this project is making me insane. </span> </p> </div>`);
}

function getAllCoins() {
    loader(jQuery('#mainPage'));
    jQuery.get("https://api.coingecko.com/api/v3/coins/list", function (result) {
        jQuery('#loader').remove();
        app.newResultArray = [...result];
        app.newResultArray.splice(100);
        getCoinCards(app.newResultArray);
    });
}

function getCoinCards(resultArray) {
    for (let i = 0; i < resultArray.length; i++) {
        jQuery('#row').append('<div id="cardGrid"></div>');//cardGrid
        jQuery('#cardGrid').append('<div id="card" class = "cardDesign card"></div>');//card
        jQuery('#card').append(`<div id="cardBody${i}" class="cardBody card-body border-primary mb-3"></div>`);//cardBody
        jQuery('#cardBody' + i).append(`
        <label id="mySwitch${i}" class="switch">
            <input id="myToggle${i}" data-coin-name="${resultArray[i].symbol}" type="checkbox"> 
            <div class="slider round"></div> 
        </label> 
        <h2 class="card-title${i}"></h2>`);
        jQuery('#myToggle' + i).click(addOrRemoveCoin);
        jQuery('.card-title' + i).text(`${resultArray[i].symbol}`);
        jQuery('#cardBody' + i).append(`<h7 class="card-subtitle${i}"></h7>`);
        jQuery('.card-subtitle' + i).html(`${resultArray[i].name} <br><br>`);
        jQuery('#cardBody' + i).append(`<button id="button${i}" class="info-button" data-toggle = "collapse" data-target= "#info${i}" > </button>`);
        jQuery(`#button${i}`).text('More Info').click(isButtonPushed);
        jQuery('#cardBody' + i).append(`<div id="info${i}" class="collapse"></div>`);
    }
}

function loader(parentElementId) {
    parentElementId.append('<div id="loader"></div>');
    jQuery('#loader').append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
}

function isButtonPushed() { // needs to make the interval starts only when info is collapsed (and after 2 minutes)
    let idx = (this.id).slice(6);
    loader(jQuery('#info' + idx));

    let localStorageItem = JSON.parse(window.localStorage.getItem('localStorageObj' + idx));

    if (localStorageItem == null) {
        //let infoElement = document.getElementById('info' + idx);
        //console.log(infoElement);
        //if ((infoElement.classList.contains('show')) == false) {
        let timePast = setInterval(() => {
            app.numOfSecondsPast++;
            console.log(app.numOfSecondsPast);
        }, 1000);
        //}
        let isFirst = true;
        getCoinInfoFromAjax(timePast, idx, isFirst);
    } else { // if there's something in local storage - if (localStorageItem != null)
        if (app.numOfSecondsPast < app.PURGE_IN_SECONDS) {
            jQuery('#loader').remove();
            jQuery('#info' + idx).empty();
            jQuery('#info' + idx).append('<img id= "img' + idx + '" src="' + localStorageItem.img + '"></img><div>' + localStorageItem.info + '</div>');
        } else {
            app.numOfSecondsPast = 0;
            let timePast = setInterval(() => {
                app.numOfSecondsPast++;
                //console.log(app.numOfSecondsPast);
            }, 1000);
            let isFirst = false;
            jQuery('#info' + idx).empty();
            getCoinInfoFromAjax(timePast, idx, isFirst);
        }
    }

}

function getCoinInfoFromAjax(timePast, idx, isFirst) {
    if (!isFirst) { // check if it works
        clearInterval(timePast);
    }
    jQuery.get("https://api.coingecko.com/api/v3/coins/" + app.newResultArray[idx].id, function (coinInfo) {
        jQuery('#loader').remove();
        let coinValue = `<b>USD:</b> ${coinInfo.market_data.total_volume.usd} &#36<br>
                        <b>EUR:</b> ${coinInfo.market_data.total_volume.eur} \u20AC<br>
                        <b>ILS:</b> ${coinInfo.market_data.total_volume.ils} &#8362`;
        jQuery('#info' + idx).append('<img id= "img' + idx + '" src="' + coinInfo.image.small + '"></img><div>' + coinValue + '</div>');
        let localStorageObj = {
            img: jQuery('#img' + idx).attr('src'),
            info: coinValue,
        };
        window.localStorage.setItem('localStorageObj' + idx, JSON.stringify(localStorageObj));
    });
}

main();

function addOrRemoveCoin() {
    if (this.checked) {
        if (app.countSelectedCoins > 4) {
            for (let i = 0; i < app.selectedCoinsArray.length; i++) {
                jQuery('#btnRemoveCoin' + i).text(app.selectedCoinsArray[i]);
            }
            app.selectedCoinsArray.push(jQuery(this).attr('data-coin-name'));
            console.log(app.selectedCoinsArray);
            jQuery("#myModal").modal('show');
        } else {
            //add the coin to app.selectedCoinsArray
            app.selectedCoinsArray.push(jQuery(this).attr('data-coin-name'));
            console.log(app.selectedCoinsArray);
            app.countSelectedCoins++;
        }
    }
    else { //if unchecked
        for (let i = 0; i < app.selectedCoinsArray.length; i++) {
            if (app.selectedCoinsArray[i] == jQuery(this).attr('data-coin-name')) {
                app.selectedCoinsArray.splice(i, 1);
            }
        }
        console.log(app.selectedCoinsArray);
        app.countSelectedCoins--;
    }
}

function addModalElement() {
    jQuery('#ModalElement').append(`<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-sm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">please choose which coin to remove</h4>
            </div>
            <div id="coinAdded" class="modal-body">
                <button id="btnRemoveCoin0" class="btnRemoveCoin"></button> <br>
                <button id="btnRemoveCoin1" class="btnRemoveCoin"></button> <br>
                <button id="btnRemoveCoin2" class="btnRemoveCoin"></button> <br>
                <button id="btnRemoveCoin3" class="btnRemoveCoin"></button> <br>
                <button id="btnRemoveCoin4" class="btnRemoveCoin"></button>
            </div>
            <div class="modal-footer">
                <button type="button" class="closeBtn btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>`);

    for (let i = 0; i < 5; i++) {
        //jQuery('#btnRemoveCoin' + i).on('click', removeCoin);
        jQuery('#btnRemoveCoin' + i).on("click", replaceSelectedCoins);
    }
    jQuery('.closeBtn').click(function () { // when a user doesn't want to replace a coin with another and press close, remove last item in array
        app.selectedCoinsArray.pop();
        console.log(app.selectedCoinsArray);
    });
}

function replaceSelectedCoins() {
    for (let i = 0; i < app.selectedCoinsArray.length; i++) {
        if (app.selectedCoinsArray[i] == jQuery(this).text()) {
            app.selectedCoinsArray.splice(i, 1);
            jQuery("#myModal").modal('toggle');
            console.log(app.selectedCoinsArray);
        }
    }

    //make the toggle switch in off status - not complete
    console.log(jQuery(this).text());
    for (let i = 0; i < 100; i++) {
        if (jQuery(`#myToggle${i}`).attr('data-coin-name') == jQuery(this).text()) {
            //jQuery(`#mySwitch${i} input:checked+.slider`).css({ 'background-color': '#ccc' });
            jQuery(`input:checked+.slider:before`).css('transform','translateX(1px)');
        }
    }
}


/* 
div {
  transform: translate(50px, 100px);
}
*/