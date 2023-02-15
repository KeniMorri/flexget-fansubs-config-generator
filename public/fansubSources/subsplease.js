const puppeteer = require('puppeteer');
const {anime} = require('../dataPacker');

//import puppeteer from 'puppeteer';
async function getListOfShows() {
        const browser = await puppeteer.launch({headless: false});
        //const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //Navigate to webpage
        await page.goto('https://subsplease.org/schedule/');
    
        // Set screen size
        await page.setViewport({width: 1080, height: 1024});
        await page.waitForNetworkIdle();
    
    
        // Wait for element to exist
        const searchResultSelector = '.post-content-wrapper';
        await page.waitForSelector(searchResultSelector);
    
        // Locate the full title with a unique string
        const textSelector = await page.waitForSelector(
          '.post-content-wrapper'
        );

        const listOfHTMLElements = await textSelector.$$('a');

        //const grabFirst = await listOfHTMLElements[0].evaluate(el => el.textContent);
        let listOfTitles = [];
        let listOfImg = [];
        let animeTitles = [];
        
        for await (item of listOfHTMLElements) {
            let title = await item.evaluate(el => el.textContent);
            let img = await item.evaluate(el => el.getAttribute('data-preview-image'));

            animeTitles.push( await processTitle(title, img) );
            //console.log("Title:" + content);
            listOfTitles.push(title);
            listOfImg.push(img);
        }

        
    
        await browser.close();
        // Print the full title
        //console.log('The title of this blog post is "%s".', listOfTitles);
        //console.log('Length:' + listOfTitles.length)
        //console.log(listOfImg);
        //console.log(animeTitles);
        return animeTitles;
};

function processTitle(title, img) {
    const regex = /S[0-9]$/;
    let animeTitle = new anime(title, "1", img)
    if(title.match(regex)) {
        animeTitle.season = title.slice(-1);
        animeTitle.title = (title.substring(0, title.length - 2)).trim();
    }
    return animeTitle;
}

module.exports = { getListOfShows };