const puppeteer = require('puppeteer');
const fanSubber = require('./fansubSources/subsplease');
const tvDB = require('./seriesTitleVerifier/tvdb')
const {anime} = require('./dataPacker');

var animeList = [];
function runRoutine() {
  (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://developer.chrome.com/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    // Type into search box
    await page.type('.search-box__input', 'automate beyond recorder');

    // Wait and click on first result
    const searchResultSelector = '.search-box__link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      'text/Customize and automate'
    );
    const fullTitle = await textSelector.evaluate(el => el.textContent);

    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close();
  })();
}

async function scanFansubber() {
  
  let animeTitles = await fanSubber.getListOfShows();
  console.log(await animeTitles);
  
  /*
  let animeTitles = [];
  animeTitles.push(new anime('naruto', '1', 'test'));
  animeTitles.push(new anime('bleach', '1', 'test'));
  animeTitles.push(new anime('My Hero Academia', '1', 'test'));
  animeTitles.push(new anime('One Punch man', '1', 'test'));
  animeTitles.push(new anime('boochi the rock', '1', 'test'));
  */
  animeTitles = await tvDB.queryTitle(animeTitles);
  console.log(await animeTitles);

  return 1;
}

module.exports = { runRoutine, scanFansubber };
