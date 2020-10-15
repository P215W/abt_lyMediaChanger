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
const NEXT_EDITOR = "Marcel Bischoff (MAB)"; // FIX ME / TO DO: long-term this will most likely become an array of editors, from which we pick one randomly for each loop iteration

(async () => {
  // 1.: get spreadsheet data:
  const spreadsheetData = await GetSpreadsheetData.data(
    workbookName,
    worksheetName
  );

  // 2.:
  console.log("spreadsheetData: ", spreadsheetData);

  // 3.:
  const spreadedArray = [...spreadsheetData];

  // 4.:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {
      // open asset with Brocarize-Code:
      const brocarizationResult = await Brocarize.data(
        asset.lyMediaLink,
        IS_LAB,
        IS_ENVIRONMENT_EN,
        USERNAME,
        USER_IDENTIFICATION,
        CHANGE_COMMENTARY,
        NEXT_EDITOR
      );

      // default scenario:
      asset.alreadyBrocarized = false;
      asset.canGetBrocarized = true;
      asset.brocarized = true;
      asset.isChecked = true;

      // case 'asset is already brocarized':
      if (brocarizationResult === "alreadyBrocarized true") {
        asset.alreadyBrocarized = true;
      }

      // case 'asset cannot be brocarized':
      if (brocarizationResult === "canGetBrocarized false") {
        asset.canGetBrocarized = false;
        asset.brocarized = false;
      }

      console.log(
        "spreadedArray at end of single asset processing: ",
        spreadedArray
      );

      await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);

      console.log(`Process done for ${asset.lyMediaLink}`);
    } else continue;
  }
})();
