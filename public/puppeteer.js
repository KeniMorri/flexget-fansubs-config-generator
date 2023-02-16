const puppeteer = require('puppeteer');
const fanSubber = require('./fansubSources/subsplease');
const seriesTitleVerifier = require('./seriesTitleVerifier/tvdb')
const {anime} = require('./dataPacker');

//Scans source for titles
async function scanFansubber() {
  //Set this as a "setting" variable later on
  let splitAmount = 8;
  
  //Gets list of shows from fanSubber
  let animeTitles = await fanSubber.getListOfShows();

  //Split up the results of getting list of shows for multithreaded search
  let splitAddion = animeTitles.length/splitAmount;
  let splitAnimeTitles = [];
  for(let i = 0; i < animeTitles.length; i = i + splitAddion ) {
    splitAnimeTitles.push(animeTitles.slice(i, i + splitAddion) );
  }
  
  Promise.all(splitAnimeTitles.map(anime => seriesTitleVerifier.queryTitle(anime)))
  .then((values) => {
    //Combining all returned values into a simpler array
    let newArray = values[0];
    if (values.length > 1) {
      for(let i = 1; i < values.length; i++) {
        newArray = newArray.concat(values[i]);
        //console.log(newArray);
      }
    }
    console.log(newArray);
    console.log(newArray.length);
    
  })
  
  //console.log(await animeTitles);

  return 1;
}

module.exports = { scanFansubber };
