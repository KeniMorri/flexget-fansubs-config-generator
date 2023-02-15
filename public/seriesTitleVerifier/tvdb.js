const puppeteer = require('puppeteer');
const {anime} = require('../dataPacker');
//import puppeteer from 'puppeteer';



async function queryTitle(anime) {
        const browser = await puppeteer.launch({headless: false});
        //const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for(let i = 0; i < anime.length; i++) {
            //console.log("Processing: " + anime[i].title);
            //Navigate to webpage
            //If this is the first iteration we need to go to the website and we can request the exact search result
            if ( i == 0) {
                await page.goto('https://thetvdb.com/search?menu[type]=series&query=' + anime[i].title);
                // Set screen size
                await page.setViewport({width: 1080, height: 1024});
            }
            else {
                //Otherwise type into the search element on the page
                await page.evaluate( () => document.getElementsByClassName('ais-SearchBox-input')[0].value = "");
                await page.type('.ais-SearchBox-input', anime[i].title);
                await page.waitForNetworkIdle();
            }

            //Title
            const searchResultSelector = 'li.ais-Hits-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)';
            await page.waitForSelector(searchResultSelector).then( async () => {
                let verifiedTitleSelector = await page.$(searchResultSelector);
                let verifiedTitle = await verifiedTitleSelector.evaluate(el => el.textContent);
                
                //ID
                const searchResultId = 'li.ais-Hits-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)';
                let verifiedIdSelector = await  page.$(searchResultId);
                let verifiedId = await verifiedIdSelector.evaluate(el => el.textContent);
                
                anime[i].setVerifiedTitleAndId(verifiedTitle, verifiedId);
            })
            
            /*
            console.log('Verified Title = ' + verifiedTitle);
            console.log('Verified ID =' + verifiedId);
            */
        }
        await browser.close();
        return anime;
};

module.exports = { queryTitle };