const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const GetBrocaByButtonColor = require("../modules/GetBrocaByButtonColor");
const InitiatePuppPage = require("../modules/InitiatePuppPage");

const workbookName = "IMPP ImgEN missing brocalink 1";
const worksheetName = "IMPP ImgEN missing brocalink";
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

  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isChecked === false) {

      const assetLink = asset.lyMediaLink;
      const assetId = assetLink
        .replace("https://ribosom-us.miamed.de/ly_media_asset/", "")
        .replace("/edit", "");
      console.log("assetId: ", assetId);

      const { browser, page } = await InitiatePuppPage.data(
        asset.lyMediaLink,
        USERNAME,
        USER_IDENTIFICATION
      );

      const { buttonColorTranslated, hasBrocalink } = await GetBrocaByButtonColor.data(page);

      console.log("buttonColorTranslated: ", buttonColorTranslated)
      console.log("hasBrocalink: ", hasBrocalink)
      asset.brocaButtonColor = buttonColorTranslated;
      asset.hasBrocalink = hasBrocalink;
      asset.isChecked = true;

      await SetSpreadsheetData.data(workbookName, worksheetName, spreadedArray);

      console.log(
        `-- Process done for ${asset.lyMediaLink} --`
      );
      await browser.close();
    } else continue;
  }
})(
    {
  lyMediaLink: "https://ribosom-us.miamed.de/ly_media_asset/13901/edit", // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
  isChecked: false,
  hasBrocalink: null,
}
);
