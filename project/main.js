/* 
1.need to continue from p.6 - loader.
2. needs to adjust for mobile
*/

function main() {
    homePage();
    jQuery("#home").click(homePage);
    let liveReports = document.getElementById('liveReports').addEventListener('click', liveReportsPage);
    let about = document.getElementById('about').addEventListener('click', aboutPage);

}

function homePage() { //creating the home page
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
            cardBody.className = 'card-body';
            cardBody.classList.add('border-primary');
            cardBody.classList.add('mb-3');
            card.appendChild(cardBody);

           /*  let toggleButton = document.createElement('h2');
            cardHeader.className = 'card-title';
            cardBody.appendChild(toggleButton);
            $( ".target" ).toggle(); */

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

                        let price = document.createElement('div');
                        price.innerHTML = `<b>USD:</b> ${coinInfo.market_data.total_volume.usd} &#36<br>
                        <b>EUR:</b> ${coinInfo.market_data.total_volume.eur} \u20AC<br>
                        <b>ILS:</b> ${coinInfo.market_data.total_volume.ils} &#8362`;

                        info.appendChild(img);
                        info.appendChild(price);
                    }
                });
            });
        }
    });
}

function liveReportsPage() { //creating the live reports page

}

function aboutPage() { //creating the about page

}


main();