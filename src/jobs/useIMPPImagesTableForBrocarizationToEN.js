const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const Brocarize = require("../modules/BrocarizeVersionForWorkingWithATable");

const workbookName = "IMPP Images DE 1";
const worksheetName = "IMPP Images DE";
const IS_LAB = false;
const IS_ENVIRONMENT_EN = false;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
const CHANGE_COMMENTARY = "autorun_brocarize";
const NEXT_EDITOR = null; // = "Marcel Bischoff (MAB)"; // FIX ME / TO DO: long-term this will most likely become an array of editors, from which we pick one randomly for each loop iteration

(async (singleAsset) => { // here you can pass in a single asset object which is put in first place of the looped-through array, to test/revisit a particular asset of interest (e.g. tatht has special characteristics to test edge cases etc.)
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

  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {
      console.log(`-- Process initiated for ${asset.lyMediaLink} --`);
      // opens asset with Brocarize-Code:
      const brocarizationResult = await Brocarize.data(
        asset.lyMediaLink,
        IS_LAB,
        IS_ENVIRONMENT_EN,
        USERNAME,
        USER_IDENTIFICATION,
        CHANGE_COMMENTARY,
        NEXT_EDITOR
      );

      // default property scenario:
      asset.isBrocarizable = true;
      asset.alreadyBrocarized = false;
      asset.autoBrocarized = true;
      asset.inSumBrocarized = true;
      asset.isChecked = true;

      // case 'asset is already brocarized':
      if (brocarizationResult === "alreadyBrocarized true") {
        asset.alreadyBrocarized = true;
        asset.autoBrocarized = false;
      }

      // case 'asset cannot be brocarized', e.g. not through editorial workflow yet, and therefore lacks title etc.:
      if (brocarizationResult === "isBrocarizable false") {
        asset.isBrocarizable = false;
        asset.autoBrocarized = false;
        asset.inSumBrocarized = true;
      }

      await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);

      console.log(
        `---- Process done for ${asset.lyMediaLink} with ${brocarizationResult} ----`
      );
    } else continue;
  }
})(
//   {
//   lyMediaLink: "https://ribosom.miamed.de/ly_media_asset/15577/edit", // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
//   isChecked: false,
//   isBrocarizable: null,
//   alreadyBrocarized: null,
//   autoBrocarized: null,
//   inSumBrocarized: null,
// }
);
