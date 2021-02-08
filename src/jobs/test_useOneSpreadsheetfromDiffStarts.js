const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");

(async function test_useOneSpreadsheetfromDiffStarts(entryPointAsset) {
    console.log("did run");
  // pukll in spreadsheet
  const data = await GetSpreadsheetData.data(
    "Exam Images DE 1",
    "Exam Images DE"
  );
  // make a change in data (in sense of mappinf the data)
  const newData = data.map((elementObject) => {
    if (
      elementObject.lyMediaLink ===
      `https://ribosom.miamed.de/ly_media_asset/${entryPointAsset}/edit`
    ) {
      elementObject.isChecked = "Test isChecked";
      elementObject.isUsed = "Test isUsed";
      return elementObject;
    } else {
        return elementObject;
    }
  });
  // overwrite spreadsheet data:
  await SetSpreadsheetData.data(
    "Exam Images DE 1",
    "Exam Images DE",
    newData
  );

  // repeat with diff starting point
})(15206);
