const puppeteer = require('puppeteer');
const {anime} = require('../dataPacker');


//This function will query the Title Verifier for the normalized title for sorting purposes
async function queryTitle(anime) {
    //Setup browsers, headless: false means that a browser window will spawn
    //const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Loop the array of animes that was sent thru
    for(let i = 0; i < anime.length; i++) {
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

        //If title is not found then this try catch will ensure that program does not stall
        try {
            //Title CSS selector
            const searchResultSelector = 'li.ais-Hits-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)';
            
            //Look for the selector for the title
            //timeout set to 3000ms to shorten time if title is not found
            await page.waitForSelector(searchResultSelector, { timeout: '4000' })
                .then( async () => {
                    //Title
                    let verifiedTitleSelector = await page.$(searchResultSelector);
                    let verifiedTitle = await verifiedTitleSelector.evaluate(el => el.textContent);
                    
                    //ID
                    const searchResultId = 'li.ais-Hits-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)';
                    let verifiedIdSelector = await  page.$(searchResultId);
                    let verifiedId = await verifiedIdSelector.evaluate(el => el.textContent);
                    
                    anime[i].setVerifiedTitleAndId(verifiedTitle, verifiedId);
                }
            )
        }
        catch (error) {
            console.log(error);
            console.log('Most likely the title search was not able to pull up any results')
        } 
    }
    await browser.close();
    console.log('Query Complete');
    return anime;
};

module.exports = { queryTitle };