const GetRawMediaID = require("./RawMediaID/GetRawMediaID");
const SetRawMediaID = require("./RawMediaID/SetRawMediaID");

async function SaveAsset(page) {

  const rawMediaId = await GetRawMediaID.data(page);
  if (rawMediaId === "" | rawMediaId === null | rawMediaId === undefined) {
    await SetRawMediaID.data(page, "0;");
  }

  try {
    await Promise.all([
      page.click(".sf_admin_action_save input"),
      page.waitForNavigation(),
    ]);
  } catch(err) {
    throw new Error(`Error at save-input: ${err}`);
  }

  // COPE WITH SAVING-RELATED ERRORS:
  const hasError = await page.$(".error");
  if (hasError === null) {
    console.log(`No errors were received. Saving was succesful!`);
  }
  if (hasError) {
    console.log("Saving was NOT succesfull!");
    throw new Error("Saving NOT succesfull! A LyMedia error message was seen.");
  }
}

exports.data = SaveAsset;
