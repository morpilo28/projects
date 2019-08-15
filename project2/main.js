/* 
last update: 15/08/19 11:53

1. need to continue from p.6 - save to local storage.
2. make everything jquery?
3. needs to adjust for mobile

*/
"use strict";

const app = {
    PURGE_IN_SECONDS: 120,
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

    jQuery('.background').css('height', '416%');
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
        let first100coins = getCoinCards(result);

        for (let i = 0; i < 100; i++) {
            let click = 0;
            jQuery('#button' + i).click(function () {
                //document.getElementById('button' + i).addEventListener('click', function () {
                if (click == 0) {
                    loader(jQuery('#info' + i));
                    jQuery.get("https://api.coingecko.com/api/v3/coins/" + first100coins[i].id, function (coinInfo) {
                        jQuery('#loader').remove();
                        let info = document.getElementById('info' + i);

                        let img = document.createElement('img');
                        img.src = coinInfo.image.small

                        let value = document.createElement('div');
                        let coinValue = `<b>USD:</b> ${coinInfo.market_data.total_volume.usd} &#36<br>
                    <b>EUR:</b> ${coinInfo.market_data.total_volume.eur} \u20AC<br>
                    <b>ILS:</b> ${coinInfo.market_data.total_volume.ils} &#8362`;
                        value.innerHTML = coinValue;

                        info.appendChild(img);
                        info.appendChild(value);

                        window.localStorage.setItem('img' + i, JSON.stringify(img.src));
                        window.localStorage.setItem('coinValue' + i, JSON.stringify(coinValue));
                    });
                    click++;
                } else {
                    jQuery('#info' + i).empty();
                    click = 0;
                }
            });
        }
    });
}

function getCoinCards(result) {
    let first100coins = [];
    for (let i = 0; i < 100; i++) {
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

        //toggleSwitch(cardBody, i);

        let cardHeader = document.createElement('h2');
        cardHeader.className = 'card-title';
        cardBody.appendChild(cardHeader);
        cardHeader.innerText = result[i].symbol;

        let cardSubtitle = document.createElement('h7');
        cardSubtitle.className = 'card-subtitle';
        cardBody.appendChild(cardSubtitle);
        cardSubtitle.innerHTML = result[i].name + '<br><br>';

        let infoButton = document.createElement('button');
        infoButton.className = 'info-button';
        infoButton.setAttribute('data-toggle', 'collapse');
        infoButton.setAttribute('data-target', '#info' + i);
        infoButton.id = 'button' + i;
        cardBody.appendChild(infoButton);
        infoButton.innerHTML = 'More Info';

        let info = document.createElement('div');
        info.id = 'info' + i;
        info.className = 'collapse';
        cardBody.appendChild(info);

        first100coins.push(result[i]);
    }
    return first100coins;
}

function toggleSwitch(cardBody, i) {
    let buttonSwitch = document.createElement('div');
    buttonSwitch.classList.add('toggle', 'btn', 'btn-dark'); // to switch to off - buttonSwitch.classList.add('toggle','btn','btn-light', 'off');
    buttonSwitch.setAttribute('data-toggle', 'toggle');
    buttonSwitch.setAttribute('role', 'button');
    buttonSwitch.setAttribute('style', 'width:61.0833px');
    buttonSwitch.setAttribute('style', 'height:38px');
    cardBody.appendChild(buttonSwitch);

    let cardSwitch = document.createElement('input');
    cardSwitch.id = 'cardSwitch' + i;
    cardSwitch.setAttribute('type', 'checkbox');
    //cardSwitch.setAttribute('checked', 'true');
    cardSwitch.setAttribute('data-toggle', 'toggle');
    cardSwitch.setAttribute('data-size', 'xs');
    cardSwitch.setAttribute('data-onstyle', 'dark');
    buttonSwitch.appendChild(cardSwitch);

    let toggle = document.createElement('div');
    toggle.classList.add('toggle-group');
    buttonSwitch.appendChild(toggle);

    let label1 = document.createElement('label');
    label1.classList.add('btn', 'btn-dark', 'toggle-on');
    label1.innerText = 'On';
    toggle.appendChild(label1);

    let label2 = document.createElement('label');
    label2.classList.add('btn', 'btn-light', 'toggle-off');
    label2.innerText = 'Off';
    toggle.appendChild(label2);

    let span = document.createElement('span');
    span.classList.add('toggle-handle', 'btn', 'btn-light');
    span.innerText = 'Off';
    toggle.appendChild(span);
}

function loader(parentElementId) {
    parentElementId.append('<div id="loader"></div>');
    jQuery('#loader').append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
}

main();

