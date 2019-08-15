/* 
1. need to continue from p.6 - save to local storage.
2. make everything jquery?
3. needs to adjust for mobile

*/
"use strict";

const app = {
    PURGE_IN_SECONDS: 120,
    //click: 0,
    array: [],
    numOfSecondsPast: 0,
    countSelectedCoins: 0,
};

function main() {
    homePage();
    jQuery("#home").click(homePage);
    jQuery("#liveReports").click(liveReportsPage);
    jQuery("#about").click(aboutPage);
}

function homePage() { //creating the home page
    jQuery('#currentPage').empty();
    let currentPage = document.getElementById('currentPage');
    let row = document.createElement('div');
    row.id = 'row';
    currentPage.appendChild(row);

    //jQuery('.mainPage').css('height', '416%');
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
        app.array = [...result];
        app.array.splice(100);
        getCoinCards(app.array);
    });
}

function getCoinCards(resultArray) {
    for (let i = 0; i < resultArray.length; i++) {
        let cardGrid = document.createElement('div');
        cardGrid.className = "col-md-3";
        row.appendChild(cardGrid);

        let card = document.createElement('div');
        card.className = 'card w-100';
        cardGrid.appendChild(card);

        let cardBody = document.createElement('div');
        cardBody.id = 'cardBody' + i;
        cardBody.classList.add('card-body', 'border-primary', 'mb-3');
        card.appendChild(cardBody);

        jQuery('#cardBody' + i).append('<label class="switch"><input id="myToggle' + i + '" type="checkbox"><div class="slider"></div></label>');

        $('#myToggle' + i).change(counterChoice);

        let cardHeader = document.createElement('h2');
        cardHeader.className = 'card-title';
        cardBody.appendChild(cardHeader);
        cardHeader.innerText = resultArray[i].symbol;

        let cardSubtitle = document.createElement('h7');
        cardSubtitle.className = 'card-subtitle';
        cardBody.appendChild(cardSubtitle);
        cardSubtitle.innerHTML = resultArray[i].name + '<br><br>';

        let infoButton = document.createElement('button');
        infoButton.className = 'info-button';
        infoButton.setAttribute('data-toggle', 'collapse');
        infoButton.setAttribute('data-target', '#info' + i);
        infoButton.id = 'button' + i;
        cardBody.appendChild(infoButton);
        infoButton.innerHTML = 'More Info';
        document.getElementById('button' + i).addEventListener('click', isButtonPushed);

        let info = document.createElement('div');
        info.id = 'info' + i;
        info.className = 'collapse';
        cardBody.appendChild(info);
    }
}

function counterChoice() {
    if (this.checked) {
        app.countSelectedCoins++;
        if (app.countSelectedCoins > 5) {
            console.log(app.countSelectedCoins);
        } else {
            console.log(app.countSelectedCoins);
        }
    }
    else {
        app.countSelectedCoins--;
        console.log(app.countSelectedCoins);
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
    jQuery.get("https://api.coingecko.com/api/v3/coins/" + app.array[idx].id, function (coinInfo) {
        jQuery('#loader').remove();
        let coinValue = `<b>USD:</b> ${coinInfo.market_data.total_volume.usd} &#36<br>
                        <b>EUR:</b> ${coinInfo.market_data.total_volume.eur} \u20AC<br>
                        <b>ILS:</b> ${coinInfo.market_data.total_volume.ils} &#8362`;
        //value.innerHTML = coinValue;
        jQuery('#info' + idx).append('<img id= "img' + idx + '" src="' + coinInfo.image.small + '"></img><div>' + coinValue + '</div>');
        let localStorageObj = {
            img: jQuery('#img' + idx).attr('src'),
            info: coinValue,
        };
        window.localStorage.setItem('localStorageObj' + idx, JSON.stringify(localStorageObj));
    });
}

main();
