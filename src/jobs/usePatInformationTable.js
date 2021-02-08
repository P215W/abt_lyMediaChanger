const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const puppeteer = require("puppeteer");

const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const InitiatePuppPage = require("../modules/InitiatePuppPage");
const SaveAsset = require("../modules/SaveAsset");
const GetExternalAdditionUrl = require("../modules/ExternalAdditionUrl/GetExternalAdditionUrl");
const SetExternalAdditionUrl = require("../modules/ExternalAdditionUrl/SetExternalAdditionUrl");
const SetSourceAuthorLink = require("../modules/SourceAuthorLink/SetSourceAuthorLink");
const GetTitle = require("../modules/Title/GetTitle");
const GetScreenshot = require("../modules/CreateScreenshot/GetScreenshot");

const workbookName = "Pat Information 1";
const worksheetName = "Pat Information";
const IS_LAB = false;
const IS_ENVIRONMENT_EN = false;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
// const CHANGE_COMMENTARY = "autorun_adjustGesundheitsinfoURLs";
const CHANGE_COMMENTARY = "";
const NEXT_EDITOR = null; // = "Marcel Bischoff (MAB)"; // FIX ME / TO DO: long-term this will most likely become an array of editors, from which we pick one randomly for each loop iteration

(async (singleAsset) => {
  // here you can pass in a single asset object which is put in first place of the looped-through array, to test/revisit a particular asset of interest (e.g. tatht has special characteristics to test edge cases etc.)
  // gets spreadsheet data:
  const spreadsheetData = await GetSpreadsheetData.data(
    workbookName,
    worksheetName
  );
  console.log("spreadsheetData: ", spreadsheetData);

  // spreads into array to not mutate spreadsheetData directly:
  const spreadedArray = [...spreadsheetData];
  if (singleAsset) {
    spreadedArray.unshift(singleAsset);
  }

  const { browser, page } = await InitiatePuppPage.data(
    "https://ribosom.miamed.de/ly_media_asset",
    USERNAME,
    USER_IDENTIFICATION,
    CHANGE_COMMENTARY
  );
  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {
      // opens asset:
      await page.goto(asset.lyMediaLink);

      // Gets current (old) link and pastes it into internal commentary:
      const currentExternalUrl = await GetExternalAdditionUrl.data(page);
      const title = await GetTitle.data(page);
      // await page.type(
      //   "#ly_media_asset_cmt",
      //   `Old link (pre january '21) was:\n${currentExternalUrl}\n----\n\n`
      // );

      // Extracts to test link from IC:
      // const IC = await GetInternalCommentary.data(page);
      // console.log("IC: ", IC);
      // const indexStart =
      //   IC.indexOf("ToTestNewLink: ") + "ToTestNewLink: ".length;
      // const indexEnd = IC.indexOf("#END_HERE#");
      // console.log("indexStart: ", indexStart);
      // console.log("indexEnd: ", indexEnd);
      // const extractedTestLink = IC.substring(indexStart, indexEnd);
      // console.log("extractedTestLink: ", extractedTestLink);

      // opens link in new tab:
      const page2 = await browser.newPage();
      page2.setDefaultNavigationTimeout(190000);
      // works: const response = await page2.goto('https://example.com/4045');

      let currentAssetExternalUrl;
      let openedPageStatus;
      let openedPageUrl;

      if (currentExternalUrl.length > 1) {
        const response = await page2.goto(currentExternalUrl);
        const object = response.headers();

        const puppRes = await page2.goto(currentExternalUrl);
        console.log(puppRes.status());
        const resStatus = puppRes.status();
        console.log("222: ", resStatus);

        // Store current (old) external url:
        currentAssetExternalUrl = currentExternalUrl;
        // Store status:
        openedPageStatus = resStatus;
        // Store opened url:
        openedPageUrl = page2.url();

        // makes screenshot of page2:
        await GetScreenshot.data(page2, `../assets/patInfoScreenshots/${title}.png`);

        await page2.close();
      } else {
        // Store current (old) external url:
        currentAssetExternalUrl = "TO CHECK - EMPTY";
        // Store status:
        openedPageStatus = "-";
        // Store opened url:
        openedPageUrl = "-";
      }

      // Updates the external url if a successfull redirect happened for given openedPageUrl:
      // if (openedPageStatus === 200 || 304) {
      //   if (openedPageUrl.length > 1)
      //   await SetExternalAdditionUrl.data(page, openedPageUrl);
      // }

      // Updates the source author link to new general info site:
      // await SetSourceAuthorLink.data(page, "https://www.gesundheitsinformation.de/ueber-uns/gesundheitsinformation/");

      const newExternalUrl = await GetExternalAdditionUrl.data(page);

      // Saves asset:
      // await SaveAsset.data(page, browser);

      //   await page2.goto(extractedTestLink);
      //   const pageTitle = await page2.$eval(".entry-title h1", (heading) => heading.innerHTML);
      //   console.log("pageTitle: ", pageTitle);

      // sets data properties:
      asset.currentAssetExternalUrl = newExternalUrl;
      asset.openedPageStatus = openedPageStatus;
      asset.openedPageUrl = openedPageUrl;
      asset.title = title;
      asset.isChecked = true;

      await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);

      console.log(`---- Process done for ${asset.lyMediaLink} ----`);
    } else continue;
  }
  console.log("------ JOB DONE ------")
})();
//   {
//   lyMediaLink: "https://ribosom.miamed.de/ly_media_asset/15577/edit", // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
//   isChecked: false,
//   isBrocarizable: null,
//   alreadyBrocarized: null,
//   autoBrocarized: null,
//   inSumBrocarized: null,
// }
