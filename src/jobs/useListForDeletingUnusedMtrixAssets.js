const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const InitiatePuppPage = require("../modules/InitiatePuppPage");
const GetUsageHasAnyEmbedding = require("../modules/GetUsageHasAnyEmbedding");
const DeleteAsset = require("../modules/DeleteAsset/DeleteAsset");

const workbookName = "Not Implemented Meditricks 1";
const worksheetName = "Not Implemented Meditricks";
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;

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
    USER_IDENTIFICATION
  );

  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {
      await page.goto(asset.lyMediaLink);

      const assetHasUsage = await GetUsageHasAnyEmbedding.data(page);

      if (!assetHasUsage) {
        // pathway: no usage
        await DeleteAsset.data(page, asset.lyMediaLink);
        asset.isChecked = true;
      } else {
        // pathway: usage existent
        throw new Error("the asset is used!!! - something went wrong!");
      }

      await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);

      console.log(`-- Process done for ${asset.lyMediaLink} --`);
    } else continue;
  }
})({
  //   lyMediaLink: "https://ribosom.miamed.de/ly_media_asset/13901/edit", // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
  //   isChecked: false,
  //   wasTagged: null,
});
