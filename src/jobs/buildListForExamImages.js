// require's:
const result = require("dotenv").config({
    // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
    path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
  });
  const puppeteer = require("puppeteer");
  const makeLyMediaList = require("../modules/MakeLyMediaList");
  const errorList = require("../assets/errorList");
  const GetUsageHasOneSpecificEmbedding = require("../modules/GetUsageHasOneSpecificEmbedding");
  const PutArrayIntoSpreadsheet = require("../modules/PutArrayIntoSpreadsheet");
  
  console.log(result);
  
  // CONST's (hardcoded variables):
  const IS_RE_RUN_FROM_LAST_SUCCESS_AT = null; // default value: null; In case of errors, this should equal the last successfully saved asset id (as string type!, e.g. "11174")
  const RUN_NUMBER = "1"; // default value: "1"; In case of errors, this should be ascending for each new run, i.e. first rerun would be "2" and so forth
  const URL_FOR_USE = process.env.BASE_URL_PROD_DE;
  const IS_ENVIRONMENT_EN = false;
  const USERNAME = process.env.USER;
  const USER_IDENTIFICATION = process.env.PASS;
  const CHANGE_COMMENTARY = null;
  const SPREADSHEET_NAME = "Exam Images DE";
  const SPREADSHEET_WORKSHEET_NAME = "Exam Images DE"; // for the "Reiter" of a spreadsheet
  
  const LYMEDIA_SEARCH_TITLE = null;
  const LYMEDIA_SEARCH_DESCRIPTION = null;
  const LYMEDIA_SEARCH_AUTHOR = null;
  const LYMEDIA_SEARCH_STATUS = null; // e.g. number type 40 to select 40%
  const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
  const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = "dr_merkel";
  const LYMEDIA_SEARCH_REQUIRE_TAGS = null;
  const LYMEDIA_SEARCH_EXCLUDE_TAGS = null;
  
  // call modules with above CONST'S as their respective arguments:
  (async (isReRunFrom) => {
    console.log("ReRun argument: ", isReRunFrom);
  
    const originalArray = await makeLyMediaList.data(
      URL_FOR_USE,
      IS_ENVIRONMENT_EN,
      USERNAME,
      USER_IDENTIFICATION,
      LYMEDIA_SEARCH_TITLE,
      LYMEDIA_SEARCH_DESCRIPTION,
      LYMEDIA_SEARCH_AUTHOR,
      LYMEDIA_SEARCH_STATUS,
      LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE,
      LYMEDIA_SEARCH_CHOOSECOPYRIGHTS,
      LYMEDIA_SEARCH_REQUIRE_TAGS,
      LYMEDIA_SEARCH_EXCLUDE_TAGS
    ); // RETURNS AN ARRAY OF ID'S
  
    const errorArray = [];
    let updatedArray = [];
    if (isReRunFrom) {
      const newStartPosition = originalArray.indexOf(isReRunFrom) + 1;
      updatedArray = originalArray.slice(newStartPosition, originalArray.length);
    }
  
    // IF THERE IS A RERUN, THEN USE THE UPDATED ARRAY (INSTEAD OF THE originalArray) SO THAT YOU CAN START WHERE THE PREVIOUS RUN STOPPED:
    const assetArray = updatedArray.length >= 1 ? updatedArray : originalArray;
    // IF WE HAD A COMPLETE RUN AND NOW ONLY A COUPLE OF NOT SAVEABLE ASSETS (AKA. ERROR-ASSETS) ARE LEFT, THEN USE THIS errorArray FOR A LAST RUN:
    const arrayForLoop = errorArray.length >= 1 ? errorArray : assetArray;
  
    const arrayForTheLoopingTask = arrayForLoop.map((item) => {
      return {
        lyMediaLink: `${URL_FOR_USE}ly_media_asset/${item}/edit`,
        isChecked: false,
        isUsed: null,
      };
    });
    console.log("arrayForTheLoopingTask: ", arrayForTheLoopingTask);
  
    await PutArrayIntoSpreadsheet.data(
      arrayForTheLoopingTask,
      `${SPREADSHEET_NAME} ${RUN_NUMBER}`,
      `${SPREADSHEET_WORKSHEET_NAME}`
    );
  
    // ---- PARSE ITEMS: ----
  
    // for (let item of arrayForLoop) {
    for (let asset of arrayForTheLoopingTask) {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(190000);
  
      await page.goto(`${asset.lyMediaLink}`);
      await page.type("#signin_username", `${USERNAME}`); // cred
      await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
      await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);
  
      // check if asset is embedded somewhere in system (later on: if true, put it into list):
      let isAssetUsedInArticle;
      try {
        isAssetUsedInArticle = await GetUsageHasOneSpecificEmbedding.data(page, "Articles with this image");
      } catch (err) {
        console.log(
          `Error occured at "isAssetUsedInArticle" with id ${asset.lyMediaLink} & this message: ${err}. So far these lyMedia Ids could not be saved and have to be revisited: ${errorList.data}`
        );
      }
  
      // changes asset's properties (is processed and check asset usage):
      asset.isChecked = true;
      asset.isUsed = isAssetUsedInArticle;
  
      await PutArrayIntoSpreadsheet.data(
        arrayForTheLoopingTask,
        `${SPREADSHEET_NAME} ${RUN_NUMBER}`,
        `${SPREADSHEET_WORKSHEET_NAME}`
      );
  
      console.log("Success for " + asset.lyMediaLink);
  
      await browser.close();
    }
  
    // ---- end of for-loop ---
  
    console.log(
      "---- JOB FINISHED ---- These lyMedia Ids could not be saved and have to be revisited: ",
      errorList.data
    );
  })(IS_RE_RUN_FROM_LAST_SUCCESS_AT);
  