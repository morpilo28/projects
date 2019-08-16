/* ----- updated - 17.08.19 00:48 -----
1. need to continue from p.6 - save to local storage.
2. needs to adjust for mobile
3. check for duplicate code and arrange everything
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
    jQuery("#home").click(homePage);
    jQuery("#liveReports").click(liveReportsPage);
    jQuery("#about").click(aboutPage);
}

function homePage() { //creating the home page
    jQuery('#currentPage').empty().append('<div id="row"></div>');
    jQuery('#ModalElement').append(`<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-sm">
    <div class="modal-dialog modal-dialog-centered"> 
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">please choose which coin to remove</h4>
        </div>
        <div class="modal-body">
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
        jQuery('#btnRemoveCoin' + i).click(removeCoin);
    }

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
        jQuery('#cardGrid').append('<div id="card" class = "cardDesign card w-50"></div>');//card
        jQuery('#card').append(`<div id="cardBody${i}" class="cardBody card-body border-primary mb-3"></div>`);//cardBody
        jQuery('#cardBody' + i).append(`
        <label class="switch">
            <input id="myToggle${i}" data-coin-name="${resultArray[i].symbol}" type="checkbox"> 
            <div class="slider"></div> 
        </label> 
        <h2 class="card-title${i}"></h2>`);
        jQuery('#myToggle' + i).change(counterChoice);
        jQuery('.card-title' + i).text(`${resultArray[i].symbol}`);
        jQuery('#cardBody' + i).append(`<h7 class="card-subtitle${i}"></h7>`);
        jQuery('.card-subtitle' + i).html(`${resultArray[i].name} <br><br>`);
        jQuery('#cardBody' + i).append(`<button id="button${i}" class="info-button" data-toggle = "collapse" data-target= "#info${i}" > </button>`);
        jQuery(`#button${i}`).text('More Info').click(isButtonPushed);
        jQuery('#cardBody' + i).append(`<div id="info${i}" class="collapse"></div>`);

        /* 
        
        */
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

function counterChoice() {
    if (this.checked) {
        //add the coin to app.selectedCoinsArray
        app.selectedCoinsArray.push(jQuery(this).attr('data-coin-name'));
        console.log(app.selectedCoinsArray);
        app.countSelectedCoins++;
        jQuery('#btnRemoveCoin' + (app.countSelectedCoins - 1)).text(jQuery(this).attr('data-coin-name'));
        if (app.countSelectedCoins > 5) {
            jQuery("#myModal").modal('show');
        }
    }
    else {
        app.countSelectedCoins--;
    }
}

function removeCoin() {
    for (let i = 0; i < app.selectedCoinsArray.length; i++) {
        if (app.selectedCoinsArray[i] == (jQuery(this).text())) {
            app.selectedCoinsArray.splice(i, 1);
        }
    }
    console.log(app.selectedCoinsArray);
}

