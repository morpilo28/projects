"use strict";

const app = {
    MAX_SECONDS: 120,
    newResultArray: [],
    selectedCoinsArray: [],
    liveReportsInterval: undefined,
    coinIdSequence: 0,
    isShowSelectedCoinsPage: false, //when true, chosen coin card won't be on display
};

function init() {
    paintMainPage();
    paintHomePage();
    paintModalElement();
    $("#home").click(paintHomePage);
    $("#liveReports").click(paintLiveReportsPage);
    $("#about").click(paintAboutPage);
}

function paintMainPage() {
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
                <div id="mainLoaderElement"></div>    
            </div>
       </div>
    </div>
    <div id="currentPage" class="container-fluid"></div>`);
}

function paintHomePage() {
    app.isShowSelectedCoinsPage = false;
    $('#mainLoader').remove();
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
    if (app.newResultArray) {
        drawCoinsCards();
        checkSelectedCoins();
    } else {
        mainPageLoader();
        $.get("https://api.coingecko.com/api/v3/coins/list", (result) => {
            $('#mainLoader').remove();
            app.newResultArray = [...result].slice(499, 599);
            app.coinIdSequence = 0;
            app.newResultArray.forEach((element) => {
                element.coinId = app.coinIdSequence;
                app.coinIdSequence++;
            });
            window.sessionStorage.setItem('allCoins', JSON.stringify(app.newResultArray));
            drawCoinsCards();
            checkSelectedCoins();
        });
    }
}

function mainPageLoader() {
    $('#mainLoaderElement').append('<div id="mainLoader" class="spinner-border" role="status"></div>');
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
            <div id="loaderElement${idx}"></div>
        </div>`);
        $(`#myToggle${element.coinId}`).click(toggleCoinSelection);
        $(`#button${idx}`).click(onInfoButton);
    });
}

function checkSelectedCoins() { //make selected coins checked even after returning to home page from another page
    if (app.selectedCoinsArray) {
        app.selectedCoinsArray.forEach(coin => {
            setSwitchOfCoinState(coin.coinId, true);
        });
    }
}

function onInfoButton() {
    let idx = (this.id).slice(6);
    let coin = this.dataset.coinForInfo;
    let coinInfo = getLocalCoinInfo(coin);
    let currentInfoElement = $('#info' + idx)
    $(`#loader${idx}`).remove()
    if (!coinInfo) {
        coinInfoLoaders(idx);
        $.get("https://api.coingecko.com/api/v3/coins/" + coin, (coinInfo) => {
            $(`#loader${idx}`).remove();
            let currentPrice = coinInfo.market_data.current_price;
            let coinValue = `<b>USD:</b> ${currentPrice.usd.toFixed(2)} &#36<br>
                             <b>EUR:</b> ${currentPrice.eur.toFixed(2)} \u20AC<br>
                             <b>ILS:</b> ${currentPrice.ils.toFixed(2)} &#8362`;
            currentInfoElement.empty();
            currentInfoElement.append(`<img id="img${idx}" src="${coinInfo.image.small}"/><div>${coinValue}</div>`);
            let localCoinInfo = {
                img: $('#img' + idx).attr('src'),
                info: coinValue,
            };
            setLocalCoinInfo(coin, localCoinInfo);
        });
    } else {
        currentInfoElement.empty();
        currentInfoElement.append(`<img id="img${idx}" src="${coinInfo.img}"/><div>${coinInfo.info}</div>`);
    }
}

function coinInfoLoaders(idx) {
    $(`#loaderElement${idx}`).append(`<div id="loader${idx}" class="infoLoader spinner-border" role="status"></div>`);
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

function toggleCoinSelection() {
    let toggleElement = this;
    if (toggleElement.checked) {
        onCoinSelected(toggleElement);
    } else {
        onCoinUnselected(toggleElement);
    }
}

function onCoinSelected(thisElement) {
    let selectedCoinObj = new selectedCoin($(thisElement).attr('data-coin-id-for-toggle'), $(thisElement).attr('data-coin-name'));
    if (app.selectedCoinsArray.length > 4) {
        app.selectedCoinsArray.forEach((element, index) => {
            let modalCoinButton = $('#btnRemoveCoin' + index);
            modalCoinButton.text(element.symbol.toUpperCase());
            modalCoinButton.attr('data-coin-id', element.coinId);
        });
        app.selectedCoinsArray.push(selectedCoinObj);
        displayMaxCoinsSelectedModal();
    }
    else {
        app.selectedCoinsArray.push(selectedCoinObj);
    }
}

function displayMaxCoinsSelectedModal() {
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function onCoinUnselected(thisElement) {
    app.selectedCoinsArray.map((element, index) => {
        if (element.coinId == ($(thisElement).attr('data-coin-id-for-toggle'))) {
            app.selectedCoinsArray.splice(index, 1);
        }
    });
    if (app.isShowSelectedCoinsPage) {
        $(`#cardBody${$(thisElement).attr('data-coin-id-for-toggle')}`).css('display', 'none');
        if (app.selectedCoinsArray.length === 0) {
            $(`.cardBody`).css({ 'display': 'block' });
            app.isShowSelectedCoinsPage = false;
        }
    }
}

function selectedCoin(coinId, symbol) {
    this.coinId = coinId++;
    this.symbol = symbol;
}

function paintModalElement() {
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
        let coinToRemove = app.selectedCoinsArray[app.selectedCoinsArray.length - 1].coinId;
        setSwitchOfCoinState(coinToRemove, false);
        app.selectedCoinsArray.pop();
    });
}

function replaceSelectedCoins() {
    let coinToRemove = $(this).attr('data-coin-id');
    for (let index = 0; index < app.selectedCoinsArray.length; index++) {
        const element = app.selectedCoinsArray[index];
        if (element.coinId == coinToRemove) {
            app.selectedCoinsArray.splice(index, 1);
            $("#myModal").modal('toggle');
            break;
        }
    }

    setSwitchOfCoinState(coinToRemove, false);
}

function setSwitchOfCoinState(coin, state) {
    $(`#myToggle${coin}`).prop("checked", state);
}

function paintLiveReportsPage() {
    $('#mainLoader').remove();
    $('#currentPage').empty().append(`<div class="note"> <b> * If no data exist about a coin, the coin will not appear on the chart </b> </div>  <br>
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>`);
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
            $('#mainLoader').remove();
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
            title: "Time (chart updates every 2 seconds)"
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
    let resultCoinIds = [];
    app.newResultArray.forEach((element, index) => {
        if ($(`#myToggle${index}`).attr('data-coin-name') == ($('#search').val()).toLocaleLowerCase()) {
            resultCoinIds.push($(`#cardBody${index}`)[0].id);
        }
    });

    $('#search').val("");
    displayCoinCards(resultCoinIds);
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

function paintAboutPage() {
    $('#mainLoader').remove();
    clearInterval(app.liveReportsInterval);
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

init();