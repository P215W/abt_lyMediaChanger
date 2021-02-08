const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const puppeteer = require("puppeteer");

const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const InitiatePuppPage = require("../modules/InitiatePuppPage");
const GetAssetFilename = require("../modules/GetAssetFilename");
const GetExternalAdditionUrl = require("../modules/ExternalAdditionUrl/GetExternalAdditionUrl");
const GetScreenshot = require("../modules/CreateScreenshot/GetScreenshot");

const workbookName = "Marcs Patho List 1";
const worksheetName = "Marcs Patho List";
const IS_LAB = false;
const IS_ENVIRONMENT_EN = true;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
const NEXT_EDITOR = null; // = "Marcel Bischoff (MAB)"; // FIX ME / TO DO: long-term this will most likely become an array of editors, from which we pick one randomly for each loop iteration

async function useMarcsPathoList(singleAsset) {
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
    "https://ribosom-us.miamed.de/ly_media_asset",
    USERNAME,
    USER_IDENTIFICATION
  );
  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {
      // opens asset:
      await page.goto(asset.lyMediaLink);

      // builds bigImage URL:
      const filename = await GetAssetFilename.data(page);
      const bigImageUrl = `https://media-us.amboss.com/media/thumbs/big_${filename}`;
      // const bigImageUrl = `https://media-us.amboss.com/media/thumbs/big_5ff58d02e617e.jpg`;

      // opens link in new tab:
      // const page2 = await browser.newPage();
      // page2.setDefaultNavigationTimeout(190000);
      // await page2.bringToFront();
      // await page2.goto(bigImageUrl);
      // console.log("-- Image was successfully opened --")
      // throw new Error(" ----- Execution stopped or paused for image work! -----");
      // End

      // new trial with in new browser window (to not see diagnosis):
      const browser3 = await puppeteer.launch({ headless: false });
      const page3 = await browser3.newPage();
      page3.setDefaultNavigationTimeout(190000);

      await page3.goto(`${bigImageUrl}`);
      console.log("-- Image was successfully opened --");
      throw new Error(
        " ----- Execution stopped or paused for image work! -----"
      );
      // await page3.type("#signin_username", `${USERNAME}`); // cred
      // await page3.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
      // await Promise.all([page3.click("tfoot input"), page3.waitForNavigation()]);
      // End

      // sets data properties:
      // asset.currentAssetExternalUrl = newExternalUrl;

      // await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);
    } else continue;
  }
  console.log("------ JOB DONE ------");
}
//   {
//   lyMediaLink: "https://ribosom.miamed.de/ly_media_asset/15577/edit", // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
//   isChecked: false,
//   isBrocarizable: null,
//   alreadyBrocarized: null,
//   autoBrocarized: null,
//   inSumBrocarized: null,
// }
exports.data = useMarcsPathoList;
