/* ----- updated - 02.09.19 15:00 -----
1. add documentation. */

"use strict";

const app = {
    MAX_SECONDS: 120,
    newResultArray: [],
    selectedCoinsArray: [],
    liveReportsInterval: undefined,
    coinId: 0,
    isShowSelectedCoinsPage: false,
};

function main() {
    mainPage();
    homePage();
    modalElement();
    $("#home").click(homePage);
    $("#liveReports").click(liveReportsPage);
    $("#about").click(aboutPage);
}

function mainPage() {
    $('body').append(`    
    <div id="ModalElement"></div>
    <div id="parallax-image" class="container-fluid mainPage">
        <div class="row h-100">
            <div class="col-md-12 align-self-center">
                <header>
                    <h1 class="heading">Cryptonite</h1>
                </header>
                    <nav class="navbar w-50">
                        <button id="home" class="btnNav">Home (all coins)</button>
                        <button id="liveReports" class="btnNav">Live Reports</button>
                        <button id="about" class="btnNav">About</button>
                    </nav>
                <div id="mainLoader"></div>    
            </div>
       </div>
    </div>
    <div id="currentPage" class="container-fluid"></div>`);
}

function mainPageLoader() {
    $('#mainLoader').append('<div class="mainLoader spinner-border" role="status"></div>');
}

function coinInfoLoaders(idx) {
    $(`#loader${idx}`).append(`<div class="infoLoader loader${idx} spinner-border" role="status"></div>`);
}

function homePage() {
    app.isShowSelectedCoinsPage = false;
    $('.mainLoader').remove();
    $('#currentPage').empty().append(`
    <div>
        <input id="search" type="text">
        <button class="search-button">Search</button>
        <button class="chosenCoinsBtn">Show Chosen Coins</button>
    </div>
    <div id="row" class="row"></div>`);
    clearInterval(app.liveReportsInterval);
    $(".chosenCoinsBtn").click(onShowSelectedCoins);
    $(".search-button").click(onSearch);
    getAllCoins();
}

function getAllCoins() {
    app.newResultArray = JSON.parse(window.sessionStorage.getItem('allCoins'));
    if (app.newResultArray !== undefined && app.newResultArray !== null) {
        drawCoinsCards();
        checkSelectedCoins();
    } else {
        mainPageLoader();
        $.get("https://api.coingecko.com/api/v3/coins/list", (result) => {
            $('.mainLoader').remove();
            app.newResultArray = [...result].slice(499, 599);
            app.coinId = 0;
            app.newResultArray.map((element) => {
                element.coinId = app.coinId;
                app.coinId++;
            });
            window.sessionStorage.setItem('allCoins', JSON.stringify(app.newResultArray));
            drawCoinsCards();
            checkSelectedCoins();
        });
    }
}

function drawCoinsCards() {
    app.newResultArray.forEach((element, idx) => {
        $('#row').append(`<div id="cardBody${idx}" class="cardBody card-body border-primary col-md-2 mr-3 mt-3"></div>`);
        $('#cardBody' + idx).append(`
        <label class="switch">
            <input id="myToggle${element.coinId}" class="toggleClass" data-coin-name="${element.symbol}" data-coin-id-for-toggle = "${element.coinId}" type="checkbox"> 
            <div class="slider round"></div> 
        </label> 
        <h2> ${element.symbol.toUpperCase()} </h2>
        <h7> ${element.name} <br> <br> </h7>
        <button id="button${idx}" class="info-button" data-toggle = "collapse" data-target= "#info${idx}" data-coin-for-info="${element.id}">More Info</button>
        <div id="info${idx}" class="collapse">
            <div id="loader${idx}"></div>
        </div>`);
        $(`#myToggle${element.coinId}`).click(addOrRemoveCoin);
        $(`#button${idx}`).click(onInfoButton);
    });
}

function checkSelectedCoins() {
    if (app.selectedCoinsArray !== undefined && app.selectedCoinsArray !== null) {
        app.selectedCoinsArray.forEach(coin => {
            setSwitchOfCoinState(coin.coinNum, true);
        });
    }
}

function onInfoButton() {
    let idx = (this.id).slice(6);
    let coin = this.dataset.coinForInfo;
    let coinInfo = getLocalCoinInfo(coin);
    $(`.loader${idx}`).remove()
    if (!coinInfo) {
        coinInfoLoaders(idx);
        $.get("https://api.coingecko.com/api/v3/coins/" + coin, (coinInfo) => {
            $(`.loader${idx}`).remove();
            let coinValue = `<b>USD:</b> ${coinInfo.market_data.current_price.usd.toFixed(2)} &#36<br>
                             <b>EUR:</b> ${coinInfo.market_data.current_price.eur.toFixed(2)} \u20AC<br>
                             <b>ILS:</b> ${coinInfo.market_data.current_price.ils.toFixed(2)} &#8362`;
            $('#info' + idx).empty();
            $('#info' + idx).append(`<img id= "img${idx}" src="${coinInfo.image.small}"></img><div>${coinValue}</div>`);
            let localCoinInfo = {
                img: $('#img' + idx).attr('src'),
                info: coinValue,
            };
            setLocalCoinInfo(coin, localCoinInfo);
        });
    } else {
        $('#info' + idx).empty();
        $('#info' + idx).append(`<img id="img${idx}" src="${coinInfo.img}"></img><div>${coinInfo.info}</div>`);
    }
}

function getLocalCoinInfo(coin) {
    let coinInfo = null;
    let coinInfoStr = localStorage.getItem("coinInfo-" + coin);
    if (coinInfoStr) {
        coinInfo = JSON.parse(coinInfoStr);
        if (new Date().getTime() - coinInfo.timeSaved > app.MAX_SECONDS * 1000) {
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
    let toggleElement = this;
    if (toggleElement.checked) {
        addCoin(toggleElement);
    } else {
        removeCoin(toggleElement);
    }
}

function addCoin(thisElement) {
    let selectedCoinObj = new selectedCoin($(thisElement).attr('data-coin-id-for-toggle'), $(thisElement).attr('data-coin-name'));
    if (app.selectedCoinsArray.length > 4) {
        app.selectedCoinsArray.forEach((element, index) => {
            $('#btnRemoveCoin' + index).text(element.symbol.toUpperCase());
            $('#btnRemoveCoin' + index).attr('data-coin-id', element.coinNum);
        });
        app.selectedCoinsArray.push(selectedCoinObj);
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    else {
        app.selectedCoinsArray.push(selectedCoinObj);
    }
}

function removeCoin(thisElement) {
    app.selectedCoinsArray.map((element, index) => {
        if (element.coinNum == ($(thisElement).attr('data-coin-id-for-toggle'))) {
            app.selectedCoinsArray.splice(index, 1);
        }
    });
    if (app.isShowSelectedCoinsPage) {
        $(`#cardBody${$(thisElement).attr('data-coin-id-for-toggle')}`).css('display', 'none');
        if (app.selectedCoinsArray.length == 0) {
            $(`.cardBody`).css({ 'display': 'block' });
            app.isShowSelectedCoinsPage = false;
        }
    }
}

function selectedCoin(coinNum, symbol) {
    this.coinNum = coinNum++;
    this.symbol = symbol;
}

function modalElement() {
    $('#ModalElement').append(`<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-sm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Please choose which coin to remove</h4>
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
        $('#btnRemoveCoin' + i).click(replaceSelectedCoins);
    }
    $('.closeBtn').click(() => {
        let coinToRemove = app.selectedCoinsArray[app.selectedCoinsArray.length - 1].coinNum;
        setSwitchOfCoinState(coinToRemove, false);
        app.selectedCoinsArray.pop();
    });
}

function replaceSelectedCoins() {
    let coinToRemove = $(this).attr('data-coin-id');
    app.selectedCoinsArray.map((element, index) => {
        if (element.coinNum == coinToRemove) {
            app.selectedCoinsArray.splice(index, 1);
            $("#myModal").modal('toggle');
        }
    });
    setSwitchOfCoinState(coinToRemove, false);
}

function setSwitchOfCoinState(coin, state) {
    $(`#myToggle${coin}`).prop("checked", state);
}

function liveReportsPage() {
    $('.mainLoader').remove();
    $('#currentPage').empty().append('<div id="chartContainer" style="height: 370px; width: 100%;"></div>');
    liveReportsOfSelectedCoins();
}

function liveReportsOfSelectedCoins() {
    mainPageLoader();
    let coinsInUppercase = app.selectedCoinsArray.map(element => element.symbol.toUpperCase());
    const chartElement = $("#chartContainer");
    initChart(chartElement, coinsInUppercase);
    chartElement.css({ display: 'none' });
    clearInterval(app.liveReportsInterval);
    app.liveReportsInterval = setInterval(() => {
        $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsInUppercase.join(',')}&tsyms=USD`, (results) => {
            $('.mainLoader').remove();
            chartElement.css({ display: 'block' });
            let now = new Date();
            coinsInUppercase.map((element, index) => {
                if (results[element]) {
                    let coinCurrentValue = results[element].USD;
                    app.options.data[index].dataPoints.push({ x: now, y: coinCurrentValue });
                }
            });
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

function onSearch() {
    app.isShowSelectedCoinsPage = false;
    let searchArray = [];
    app.newResultArray.forEach((element, index) => {
        if ($(`#myToggle${index}`).attr('data-coin-name') == ($('#search').val()).toLocaleLowerCase()) {
            searchArray.push($(`#cardBody${index}`)[0].id);
        }
    });

    $('#search').val("");
    displayCoinCards(searchArray);
}

function onShowSelectedCoins() {
    app.isShowSelectedCoinsPage = true;
    let showSelectedCoinsArray = [];
    app.newResultArray.forEach((element, index) => {
        if ($(`#myToggle${index}`).prop('checked')) {
            showSelectedCoinsArray.push($(`#cardBody${index}`)[0].id);
        }
    });

    displayCoinCards(showSelectedCoinsArray);
}

function displayCoinCards(coinsArrayToDisplay) {
    $(`.cardBody`).css({ 'display': 'none' });
    if (coinsArrayToDisplay.length !== 0) {
        coinsArrayToDisplay.forEach((element, index) => $(`#${coinsArrayToDisplay[index]}`).css({ 'display': 'block' }));
    } else {
        alert('no coins found');
        $(`.cardBody`).css({ 'display': 'block' });
        app.isShowSelectedCoinsPage = false;
    }
}

function aboutPage() {
    $('.mainLoader').remove();
    $('#currentPage').empty().append(`
    <div id="aboutContainer"> 
        <p> 
            <span> <b><u> About Myself </u></b> <br> </span> <br>
            <img width = "152" height = "202" opacity= "1" src = "styles/images/mor.jpg"> </img> <br> <br>
            <span> My name is Mor. <br> I'm 28 years old. </span> <br> 
        </p> <br>
        <p> 
            <span> <b><u> The Project </u></b> <br> 
            In this project I developed a single page that provides information about 100 virtual coins. <br>
            By clicking on the "more info" button you can see the coin's price in EURO/USD/ILS. <br>
            After selecting 5 coins, you can see their current price value in USD by going to the 'live reports' section <br> 
            (you can also filter which coin you wouldn't like to see by clicking on the coin's name 
            at the bottom of the page to disable it's line in the chart).
            </span> 
        </p> 
    </div>`);
}

main();