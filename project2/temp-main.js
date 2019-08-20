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
    selectedCoinsArray: [],
    liveReportsInterval: undefined
};

function displayPage() {
    let pageId = this.id;
    let containers = ["homeContainer", "liveReportsContainer", "aboutContainer"];
    // hide all page containers
    containers.forEach(containerId => {
        jQuery("#" + containerId).css({display: "none"});
    });
    // show selected page
    jQuery("#" + pageId + "Container").css({display: "block"});
}

function main() {
    homePage();
    addModalElement();
    jQuery("#home").click(homePage);
    jQuery("#liveReports").click(liveReportsPage);
    jQuery("#about").click(aboutPage);
}

function setSwitchOfCoinState(coin, state) {
    let switchInputToDisable = jQuery(`[data-coin-name=${coin}]`);
    switchInputToDisable.prop("checked", state);
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
        jQuery('#btnRemoveCoin' + i).click(replaceSelectedCoins);
    }
    jQuery('.closeBtn').click(function () { // when a user doesn't want to replace a coin with another and press close, remove last item in array
        let coinToRemove = app.selectedCoinsArray.pop();
        setSwitchOfCoinState(coinToRemove, false);
        console.log(app.selectedCoinsArray);
    });
}

function homePage() { //creating the home page
    jQuery('#currentPage').empty().append('<div id="row"></div>');
    clearInterval(app.liveReportsInterval);
    getAllCoins();
}

function liveReportsPage() { //creating the live reports page
    jQuery('#currentPage').empty().append('<div id="chartContainer" style="height: 370px; width: 100%;"></div>');
    loader(jQuery('#mainPage'));
    //API example - "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD"

    liveReportsOfSelectedCoins();
}

function liveReportsOfSelectedCoins() {
    let coinsInUppercase = (app.selectedCoinsArray).map(a => a.toUpperCase());
    let chartElement = jQuery("#chartContainer");
    initChart(chartElement, coinsInUppercase);
    /* doesn't return all the coins */
    clearInterval(app.liveReportsInterval);
    app.liveReportsInterval = setInterval(() => {
        jQuery.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsInUppercase.join(',')}&tsyms=USD`, function (results) {
            jQuery('#loader').remove();
            let now = new Date();
            for (let i = 0; i < coinsInUppercase.length; i++) {
                let coin = coinsInUppercase[i];
                if (results[coin]) {
                  let coinCurrentValue = results[coin].USD;
                  app.options.data[i].dataPoints.push({ x: now, y: coinCurrentValue});
                }
            }
          jQuery("#chartContainer").CanvasJSChart().render();
            console.log(results);
        });
    }, 2000);
}

function aboutPage() { //creating the about page
    clearInterval(app.liveReportsInterval);
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
        getCoinCards();
        if (app.selectedCoinsArray !== undefined && app.selectedCoinsArray !== null) {
            app.selectedCoinsArray.forEach(coin => {
                setSwitchOfCoinState(coin, true);
            });
        }
    });
}

function getCoinCards() {
    for (let i = 0; i < app.newResultArray.length; i++) {
        jQuery('#row').append('<div id="cardGrid"></div>');//cardGrid
        jQuery('#cardGrid').append('<div id="card" class = "cardDesign card"></div>');//card
        jQuery('#card').append(`<div id="cardBody${i}" class="cardBody card-body border-primary mb-3"></div>`);//cardBody
        jQuery('#cardBody' + i).append(`
        <label id="mySwitch${i}" class="switch">
            <input id="myToggle${i}" data-coin-name="${app.newResultArray[i].symbol}" type="checkbox"> 
            <div class="slider round"></div> 
        </label> 
        <h2 class="card-title${i}"></h2>`);
        jQuery('#myToggle' + i).click(addOrRemoveCoin);
        jQuery('.card-title' + i).text(`${app.newResultArray[i].symbol}`);
        jQuery('#cardBody' + i).append(`<h7 class="card-subtitle${i}"></h7>`);
        jQuery('.card-subtitle' + i).html(`${app.newResultArray[i].name} <br><br>`);
        jQuery('#cardBody' + i).append(`<button id="button${i}" class="info-button" data-toggle = "collapse" data-target= "#info${i}" > </button>`);
        jQuery(`#button${i}`).text('More Info').click(isInfoButtonPushed);
        jQuery('#cardBody' + i).append(`<div id="info${i}" class="collapse"></div>`);
    }
}

function loader(parentElementId) {
    parentElementId.append('<div id="loader"></div>');
    jQuery('#loader').append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
}

function isInfoButtonPushed() { // needs to make the interval starts only when info is collapsed (and after 2 minutes)
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

function addOrRemoveCoin() {
    if (this.checked) {
        if (app.selectedCoinsArray.length > 4) {
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
        }
    }
    else { //if unchecked
        for (let i = 0; i < app.selectedCoinsArray.length; i++) {
            if (app.selectedCoinsArray[i] === jQuery(this).attr('data-coin-name')) {
                app.selectedCoinsArray.splice(i, 1);
            }
        }
        console.log(app.selectedCoinsArray);
    }
}

function replaceSelectedCoins() {
    let coinToRemove = jQuery(this).text();
    for (let i = 0; i < app.selectedCoinsArray.length; i++) {
        if (app.selectedCoinsArray[i] === coinToRemove) {
            app.selectedCoinsArray.splice(i, 1);
            jQuery("#myModal").modal('toggle');
            console.log(app.selectedCoinsArray);
        }
    }

    setSwitchOfCoinState(coinToRemove, false);
}

function initChart(chartElement, coins) {
    app.options = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "Coin Price In USD"
        },
        axisX: {
            title: "States"
        },
        axisY: {
            title: "Units Sold",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        axisY2: {
            title: "Profit in USD",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
        },
        data: []
    };

    coins.forEach(coin => {
        app.options.data.push({
            type: "spline",
            name: coin,
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "HH:mm:SS",
            yValueFormatString: "$#,##0.#",
            dataPoints: []
        })
    })
  chartElement.CanvasJSChart(app.options);

}


main();
