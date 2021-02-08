// have table imported

// create htable with image ids

// image-id | fullLink | isMastered | KK-Fach (for spaced repetition)

// import table

// hol dir ein bestimmtes Fach rein

// das Fach wird gelernt
// für gewusste assets: -> versuche bro

// for (let asset of array) {
//     if (asset.isM)


const puppeteer = require("puppeteer");
const ids = [26, 126, 226];

const dataArray = ids.map( id => {
    return {
        id: id,
        isMastered: false,
        boxLevel: 1
    };
});

// 

(async () => {



for (let id of ids) {
    // open pup page:
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();  
    await page.goto(`https://alf3.urz.unibas.ch/pathopic/getpic-fra.cfm?id=${id}`);

    await browser.on('targetchanged', () => {
        console.log("URL was changed");
    })

    await browser.on('targetdestroyed', () => {
        console.log("was destroyed");

    })
    
    // try to get an event logged at target-changed-ebent
    // try to get an event logged at destroyed-event
}
})();
