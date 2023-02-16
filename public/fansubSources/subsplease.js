const puppeteer = require('puppeteer');
const {anime} = require('../dataPacker');

//getListOfShows is expected to gather a list of Animes Titles from a source
//Packagte that into an Array of Anime
//Then Return the Array of Anime
async function getListOfShows() {
        //Setup browsers, headless: false means that a browser window will spawn
        //const browser = await puppeteer.launch({headless: false});
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Navigate to webpage
        await page.goto('https://subsplease.org/schedule/');
    
        // Set screen size
        await page.setViewport({width: 1080, height: 1024});

        //Waiting for webpage to be fully loaded before carrying on
        await page.waitForNetworkIdle();
    
    
        // Wait for element to exist
        const searchResultSelector = '.post-content-wrapper';
        await page.waitForSelector(searchResultSelector);
    
        // Locate the full title with a unique string
        const textSelector = await page.waitForSelector(
          '.post-content-wrapper'
        );

        //Look for all the /a/ elements which happen to be all the titles
        const listOfHTMLElements = await textSelector.$$('a');
        
        //Setting up an array for the titles/imgs
        let animeTitles = [];
        
        //Looping thru all elements to get all the titles/imgs/season and packing them into an anime
        for await (item of listOfHTMLElements) {
            let title = await item.evaluate(el => el.textContent);
            let img = await item.evaluate(el => el.getAttribute('data-preview-image'));
            animeTitles.push( await processTitle(title, img) );
        }

        await browser.close();
        return animeTitles;
};

//This fansubber explicitly puts the seasons at the end of the titles, so we can scan these to determine what season an anime is and pull it out
async function processTitle(title, img) {
    const regex = /S[0-9]$/;
    let animeTitle = new anime(title, "1", img)
    if(title.match(regex)) {
        animeTitle.season = title.slice(-1);
        animeTitle.title = (title.substring(0, title.length - 2)).trim();
    }
    return animeTitle;
}

module.exports = { getListOfShows };