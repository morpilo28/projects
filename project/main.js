/* 
1.need to continue from p.6 - loader.
2. needs to adjust for mobile
*/
"use strict";
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
    jQuery.get("https://api.coingecko.com/api/v3/coins/list", function (result) {
        let first100coins = [];
        for (let i = 0; i < 100; i++) {
            let cardGrid = document.createElement('div');
            cardGrid.className = "col-md-3";
            row.appendChild(cardGrid);

            let card = document.createElement('div');
            card.className = 'card w-100';
            cardGrid.appendChild(card);

            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'border-primary', 'mb-3');
            card.appendChild(cardBody);

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

        for (let i = 0; i < 100; i++) {
            //jQuery(`button${i}`).click(function(){
            document.getElementById('button' + i).addEventListener('click', function () {
                jQuery.get("https://api.coingecko.com/api/v3/coins/" + first100coins[i].id, function (coinInfo) {
                    let info = document.getElementById('info' + i);
                    if (info.childElementCount == 0) {
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
                    }
                });
            });
        }
    });
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


    main();
/* progressBar();
function progressBar() {
    let currentPage = document.getElementById('currentPage'); //needs to change to info element (id= info+1)
    let progress = document.createElement('div');
    progress.className = 'progress';
    currentPage.appendChild(progress);

    let progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar', 'progress-bar-info', 'progress-bar-striped');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    //progressBar.style('width', '50%');
    progressBar.setAttribute('style', 'width: 50%');
    progress.appendChild(progressBar);
    let width = 0;

    //let id = setInterval(frame, 100);
    let id = setInterval(function () {
        if (width >= 100) {
            clearInterval(id);
            currentPage.removeChild(progress);
        } else {
            width++;
            progressBar.style.width = width + '%';
            progressBar.innerHTML = width * 1 + '%';
        }
    }, 100);
} */