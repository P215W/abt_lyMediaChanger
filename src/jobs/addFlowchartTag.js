// require's:
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const puppeteer = require("puppeteer");
const makeLyMediaList = require("../modules/MakeLyMediaList");
const errorList = require("../assets/errorList");

console.log(result);

// CONST's (hardcoded variables):
const IS_RE_RUN_FROM_LAST_SUCCESS_AT = null; // default value: null; In case of errors, this should equal the last successfully saved asset id (as string type!, e.g. "11174")
const URL_FOR_USE = process.env.BASE_URL_PROD_DE;
const IS_ENVIRONMENT_EN = false;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
// const CHANGE_COMMENTARY = "autorun_PROD_addFCTag";

const LYMEDIA_SEARCH_TITLE = null;
const LYMEDIA_SEARCH_DESCRIPTION = "Flussdiagramm";
const LYMEDIA_SEARCH_AUTHOR = null;
const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = null;
const LYMEDIA_SEARCH_REQUIRE_TAGS = null;
const LYMEDIA_SEARCH_EXCLUDE_TAGS = null;

// call modules with above CONST'S as their respective arguments:
(async (isReRunFrom) => {
  console.log("ReRun argument: ", isReRunFrom);
  // CREATE LIST:
  // const array = [13636, 13635, 13634]; // TEST array
  const originalArray = await makeLyMediaList.data(
    URL_FOR_USE,
    IS_ENVIRONMENT_EN,
    USERNAME,
    USER_IDENTIFICATION,
    LYMEDIA_SEARCH_TITLE,
    LYMEDIA_SEARCH_DESCRIPTION,
    LYMEDIA_SEARCH_AUTHOR,
    LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE,
    LYMEDIA_SEARCH_CHOOSECOPYRIGHTS,
    LYMEDIA_SEARCH_REQUIRE_TAGS,
    LYMEDIA_SEARCH_EXCLUDE_TAGS
  ); // RETURNS AN ARRAY OF ID'S
  console.log("originalArray: ", originalArray);

  const errorArray = [];
  let updatedArray = [];
  if (isReRunFrom) {
    const newStartPosition = originalArray.indexOf(isReRunFrom) + 1;
    updatedArray = originalArray.slice(newStartPosition, originalArray.length);
  }
  console.log("updatedArray: ", updatedArray);

  // IF THERE IS A RERUN, THEN USE THE UPDATED ARRAY (INSTEAD OF THE originalArray) SO THAT YOU CAN START WHERE THE PREVIOUS RUN STOPPED:
  const assetArray = updatedArray.length >= 1 ? updatedArray : originalArray;
  // IF WE HAD A COMPLETE RUN AND NOW ONLY A COUPLE OF NOT SAVEABLE ASSETS (AKA. ERROR-ASSETS) ARE LEFT, THEN USE THIS errorArray FOR A LAST RUN:
  const arrayForLoop = errorArray.length >= 1 ? errorArray : assetArray;
  console.log("arrayForLoop: ", arrayForLoop);

  // PARSE ITEMS:
  for (let item of arrayForLoop) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000);

    const assetsUnsuccesfullSaving = [];

    await page.goto(`${URL_FOR_USE}ly_media_asset/${item}/edit`);
    await page.type("#signin_username", `${USERNAME}`); // cred
    await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
    await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

    // try to edit the tags for flowchart
    await page.type(
      "#ly_media_asset_tags_list_bildtyp_chzn input",
      "Illustration"
    );
    await page.keyboard.press("Enter");
    await page.type(
      "#ly_media_asset_tags_list_Illustration_chzn input",
      "Flowchart"
    );
    await page.keyboard.press("Enter");

      // SAVE CHANGES:
      try {
        await Promise.all([
          page.click(".sf_admin_action_save input"),
          page.waitForNavigation(),
        ]);
        console.log(`Saving was initiated correctly for ${item}`);
      } catch (err) {
        throw new Error(`Error at save-input: ${err}`);
      }
    
      // COPE WITH SAVING-RELATED ERRORS:
      const hasError = await page.$(".error");
      if (hasError === null) {
        console.log(`No errors were received. Saving was succesful for ${item} !`);
        await browser.close();
      }
      if (hasError) {
        console.log("Saving was NOT succesfull!");
        assetsUnsuccesfullSaving.push(item);
        errorList.data.push(item);
      }
      console.log("assetsUnsuccesfullSaving:", assetsUnsuccesfullSaving);

  }
  console.log(
    "---- JOB FINISHED ---- These lyMedia items could not be saved and have to be revisited: ",
    errorList.data
  );

})(IS_RE_RUN_FROM_LAST_SUCCESS_AT);
