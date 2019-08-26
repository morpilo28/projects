/* ----- updated - 26.08.19 03:09 -----
1. needs to adjust for all devices (laptop, tablet, mobile);
2.check for duplicate code and arrange everything
*/
"use strict";

const app = {
    PURGE_IN_SECONDS: 120,
    newResultArray: [],
    numOfSecondsPast: 0,
    selectedCoinsArray: [],
    liveReportsInterval: undefined,
    coinId: 0,
};

function main() {
    mainPage();
    homePage();
    addModalElement();
    $("#home").click(homePage);
    $("#liveReports").click(liveReportsPage);
    $("#about").click(aboutPage);
}

function loader(parentElementId) {
    parentElementId.append('<div id="loader"></div>');
    $('#loader').append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
}

function homePage() { //creating the home page
    $('#currentPage').empty().append(`<input id="search" type="text">
    <button class="search-button">Search</button>
    <button class="chosenCoinsBtn">Show Chosen Coins</button>
    </div>
    <div id="row text-center">
        <div id="cardGrid">
            <div id="card" class ="cardDesign card">
                <div class="columns"></div>
            </div>
        </div>
    </div>`);
    clearInterval(app.liveReportsInterval);
    $(".chosenCoinsBtn").click(function () {
        showChosenCoinsOrSearch('show');
    });
    $(".search-button").click(function () {
        showChosenCoinsOrSearch('search');
    });
    getAllCoins();
}

function getAllCoins() {
    loader($('#mainPage'));
    $.get("https://api.coingecko.com/api/v3/coins/list", function (result) {
        $('#loader').remove();
        app.newResultArray = [...result].slice(499, 599);
        app.coinId = 0;
        console.log(app.newResultArray.length);
        for (let i = 0; i < app.newResultArray.length; i++) {
            app.newResultArray[i].coinId = app.coinId;
            app.coinId++;
            getCoinCards(i);
        }

        /* app.newResultArray = [...result];
        app.newResultArray.splice(100); */

        if (app.selectedCoinsArray !== undefined && app.selectedCoinsArray !== null) {
            app.selectedCoinsArray.forEach(coin => {
                setSwitchOfCoinState(coin.coinNum, true);
            });
        }
    });
}

function getCoinCards(i) {
    $('.columns').append(`<div id="cardBody${i}" class="cardBody card-body border-primary col-md-2 float-left"></div>`);//cardBody
    $('#cardBody' + i).append(`
        <label id="mySwitch${i}" class="switch">
            <input id="myToggle${app.newResultArray[i].coinId}" class="toggleClass" data-coin-name="${app.newResultArray[i].symbol}" data-coin-id-for-toggle = "${app.newResultArray[i].coinId}" type="checkbox"> 
            <div class="slider round"></div> 
        </label> 
        <h2 class="card-title${i}"></h2>`);
    $(`#myToggle${app.newResultArray[i].coinId}`).click(addOrRemoveCoin);
    $('.card-title' + i).text(`${app.newResultArray[i].symbol.toUpperCase()}`);
    $('#cardBody' + i).append(`<h7 class="card-subtitle${i}"></h7>`);
    $('.card-subtitle' + i).html(`${app.newResultArray[i].name} <br><br>`);
    $('#cardBody' + i).append(`<button id="button${i}" class="info-button" data-toggle = "collapse" data-target= "#info${i}" data-coin-for-info="${app.newResultArray[i].id}"> </button>`);
    $(`#button${i}`).text('More Info').click(onInfoButtonClick);
    $('#cardBody' + i).append(`<div id="info${i}" class="collapse"></div>`);
}

function getLocalCoinInfo(coin) {
    let coinInfo = null;
    let coinInfoStr = localStorage.getItem("coinInfo-" + coin);
    if (coinInfoStr) {
        coinInfo = JSON.parse(coinInfoStr);
        if (new Date().getTime() - coinInfo.timeSaved > app.PURGE_IN_SECONDS * 1000) {
            coinInfo = null;
        }
    }
    return coinInfo;
}

function setLocalCoinInfo(coin, info) {
    info.timeSaved = new Date().getTime();
    localStorage.setItem("coinInfo-" + coin, JSON.stringify(info));
}

function addOrRemoveCoin() {
    if (this.checked) {
        let selectedCoinObj = new selectedCoin($(this).attr('data-coin-id-for-toggle'), $(this).attr('data-coin-name'));
        if (app.selectedCoinsArray.length > 4) {
            for (let i = 0; i < app.selectedCoinsArray.length; i++) {
                $('#btnRemoveCoin' + i).text(app.selectedCoinsArray[i].symbol.toUpperCase());
                $('#btnRemoveCoin' + i).attr('data-coin-id', app.selectedCoinsArray[i].coinNum);
            }
            app.selectedCoinsArray.push(selectedCoinObj);
            $("#myModal").modal('show');
        } else {
            //add the coin to app.selectedCoinsArray
            app.selectedCoinsArray.push(selectedCoinObj);
        }
    }
    else { //if unchecked
        for (let i = 0; i < app.selectedCoinsArray.length; i++) {
            if (app.selectedCoinsArray[i].coinNum == ($(this).attr('data-coin-id-for-toggle'))) {
                app.selectedCoinsArray.splice(i, 1);
            }
        }
    }
}

function onInfoButtonClick() {
    let idx = (this.id).slice(6);
    loader($('#info' + idx));
    let coin = this.dataset.coinForInfo;
    let coinInfo = getLocalCoinInfo(coin);
    if (!coinInfo) {
        $.get("https://api.coingecko.com/api/v3/coins/" + coin, function (coinInfo) {
            $('#loader').remove();
            let coinValue = `<b>USD:</b> ${coinInfo.market_data.total_volume.usd} &#36<br>
                        <b>EUR:</b> ${coinInfo.market_data.total_volume.eur} \u20AC<br>
                        <b>ILS:</b> ${coinInfo.market_data.total_volume.ils} &#8362`;
            $('#info' + idx).empty();
            $('#info' + idx).append('<img id= "img' + idx + '" src="' + coinInfo.image.small + '"></img><div>' + coinValue + '</div>');
            let localCoinInfo = {
                img: $('#img' + idx).attr('src'),
                info: coinValue,
            };
            setLocalCoinInfo(coin, localCoinInfo);
        });
    } else {
        $('#loader').remove();
        $('#info' + idx).empty();
        $('#info' + idx).append('<img id= "img' + idx + '" src="' + coinInfo.img + '"></img><div>' + coinInfo.info + '</div>');
    }
}

function addModalElement() {
    $('#ModalElement').append(`<div id="myModal" class="modal fade" role="dialog">
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
        $('#btnRemoveCoin' + i).click(replaceSelectedCoins);
    }
    $('.closeBtn').click(function () { // when a user doesn't want to replace a coin with another and press close, remove last item in array
        let coinToRemove = app.selectedCoinsArray[app.selectedCoinsArray.length - 1].coinNum;
        setSwitchOfCoinState(coinToRemove, false);
        app.selectedCoinsArray.pop();
    });
}

function replaceSelectedCoins() {
    let coinToRemove = $(this).attr('data-coin-id');
    for (let i = 0; i < app.selectedCoinsArray.length; i++) {
        if (app.selectedCoinsArray[i].coinNum == coinToRemove) {
            app.selectedCoinsArray.splice(i, 1);
            $("#myModal").modal('toggle');
        }
    }

    setSwitchOfCoinState(coinToRemove, false);
}

function setSwitchOfCoinState(coin, state) {
    $(`#myToggle${coin}`).prop("checked", state);
}

function liveReportsPage() { //creating the live reports page
    //$('#searchAndFFilter').remove();
    $('#currentPage').empty().append('<div id="chartContainer" style="height: 370px; width: 100%;"></div>');
    loader($('#mainPage'));

    liveReportsOfSelectedCoins();
}

function liveReportsOfSelectedCoins() {
    let coinsInUppercase = (app.selectedCoinsArray).map(a => a.symbol.toUpperCase());
    let chartElement = $("#chartContainer");
    initChart(chartElement, coinsInUppercase);
    chartElement.css({ display: 'none' });
    /* doesn't return all the coins */
    clearInterval(app.liveReportsInterval);
    app.liveReportsInterval = setInterval(() => {
        //API example - "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD"
        $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsInUppercase.join(',')}&tsyms=USD`, function (results) {
            $('#loader').remove();
            chartElement.css({ display: 'block' });
            let now = new Date();
            for (let i = 0; i < coinsInUppercase.length; i++) {
                let coin = coinsInUppercase[i];
                if (results[coin]) {
                    let coinCurrentValue = results[coin].USD;
                    app.options.data[i].dataPoints.push({ x: now, y: coinCurrentValue });
                }
            }
            $("#chartContainer").CanvasJSChart().render();
        });
    }, 2000);
}

function initChart(chartElement, coins) {
    app.options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Coin Price In USD"
        },
        axisX: {
            title: "Time\n(chart updates every 2 seconds)"
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
            title: "Coin Price in USD",
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
            itemclick: toggleDataSeries
        },
        data: []
    };

    coins.forEach(coin => {
        app.options.data.push({
            type: "spline",
            name: coin,
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "HH:mm:ss",
            yValueFormatString: "$#,##0.#",
            dataPoints: []
        })
    })

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    chartElement.CanvasJSChart(app.options);


}

function aboutPage() { //creating the about page
    //$('#searchAndFFilter').remove();
    clearInterval(app.liveReportsInterval);
    $('#currentPage').empty().append(`<div id="aboutContainer"> <p> <span> <u> About Myself </u> </span> <br>
    <img width = 152 height = 202 opacity=1 src = styles/images/mor.jpg> </img> <br> <br>
    <span> My name is Mor. <br> I'm 28 years old.<br> I came to lear fullstack so i could fine a 
    decent job but i don't know if it's going to happend. </span> <br> </p> <br>
    <p> <span> <u> The Project </u> <br> this project is making me insane. </span> </p> </div>`);
}

function showChosenCoinsOrSearch(showOrSearch) {
    $(`.cardBody`).css({ 'display': 'none' });
    let showOrSearchArray = [];
    for (let i = 0; i < app.newResultArray.length; i++) {
        if (showOrSearch == 'show') {
            if ($(`#myToggle${i}`).prop('checked')) {
                showOrSearchArray.push($(`#cardBody${i}`));
            }
        } else if (showOrSearch = 'search') {
            if ($(`#myToggle${i}`).attr('data-coin-name') == $('#search').val()) {
                showOrSearchArray.push($(`#cardBody${i}`));
            }
        }
    }
    if (showOrSearchArray.length !== 0) {
        for (let i = 0; i < showOrSearchArray.length; i++) {
            $('#' + ((showOrSearchArray[i])[0].id)).css({ 'display': 'block' });
        }
    } else {
        alert('no coins found');
        $(`.cardBody`).css({ 'display': 'block' });
    }
}

function selectedCoin(coinNum, symbol) {
    this.coinNum = coinNum++;
    this.symbol = symbol;
}

function mainPage() {
    $('body').append(`    
    <div id="ModalElement"></div>
    <div id="mainPage" class="container-fluid mainPage">
        <header class="row">
            <h1 class="header">Cryptonite</h1>
        </header>
    <div class="sticky-top">
        <nav class="navbar w-50">
            <button id="home">Home(coins)</button>
            <button id="liveReports">Live Reports</button>
            <button id="about">About</button>
        </nav>
        <div id="loader"></div>
    </div>
    <div id="currentPage" class="container-fluid"></div>
</div>`);
}
main();

