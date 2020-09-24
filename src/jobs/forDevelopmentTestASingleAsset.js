const puppeteer = require("puppeteer");
const errorList = require("../assets/errorList");
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const SetToMinimalSaveableStatus = require("../modules/SetToMinimalSaveableStatus");
const c = require("../modules/ConsoleLog");
const GetTitle = require("../modules/GetTitle");
const GetAuthorResponsible = require("../modules/GetAuthorResponsible");
const DownloadAsset = require("../modules/DownloadAsset");
const GetAssetFilename = require("../modules/GetAssetFilename");
const GetUsageHasOneSpecificEmbedding = require("../modules/GetUsageHasOneSpecificEmbedding");
const GetUsageHasAnyEmbedding = require("../modules/GetUsageHasAnyEmbedding");
const WriteToSheet = require("../modules/WriteToSheet");

// CONST's (hardcoded variables):
const IS_RE_RUN_FROM_LAST_SUCCESS_AT = "12288"; // default value: null; In case of errors, this should equal the last successfully saved asset id (as string type!, e.g. "11174")
const URL_FOR_USE = process.env.BASE_URL_LAB_DE;
const IS_ENVIRONMENT_EN = false;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
const LYMEDIA_SEARCH_TITLE = null;
const LYMEDIA_SEARCH_DESCRIPTION = null;
const LYMEDIA_SEARCH_AUTHOR = null;
const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = null;
const LYMEDIA_SEARCH_REQUIRE_TAGS = null;
const LYMEDIA_SEARCH_EXCLUDE_TAGS = null;
const TEXT_FOR_ADDING = "DO NOT USE - "; // "NICHT BENUTZEN - ";
const CHANGE_COMMENTARY = "autorun_lab_de_test";

async function forDevelopmentTestASingleAsset(
  URL_FOR_USE,
  id,
  USERNAME,
  USER_IDENTIFICATION,
  TEXT_FOR_ADDING,
  CHANGE_COMMENTARY
) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(100000);

  const assetsUnsuccesfullSaving = [];

  await page.goto(`${URL_FOR_USE}ly_media_asset/${id}/edit`);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

  await page.type("#ly_media_asset_title", "test124");

    // try to edit tag for flowchart
    await page.type("#ly_media_asset_tags_list_bildtyp_chzn input", "Illustration");
    await page.keyboard.press("Enter");
    await page.type("#ly_media_asset_tags_list_Illustration_chzn input", "Flowchart");
    await page.keyboard.press("Enter");

  const divCount = await page.$$eval("div", (divs) => divs);
  // console.log(divCount);

  const isAssetUsedInArticles = await GetUsageHasOneSpecificEmbedding.data(page, "Articles with this image");
  console.log("isAssetUsedInArticles: ", isAssetUsedInArticles);
  const isAssetUsed = await GetUsageHasAnyEmbedding.data(page);
  console.log("isAssetUsed: ", isAssetUsed);

  WriteToSheet.data(`../lists/listMaxiMDAssetsWithUsage.xlsx`, `${id}`);

  //   try {
  //     await page.waitForSelector("#ly_media_asset_tags_list_fach");
  //     await page.select(
  //       "#ly_media_asset_tags_list_fach",
  //       "medizin:fach=Augenheilkunde"
  //     );
  //     console.log("Success AT 1");
  //   } catch(err) {
  //     console.log("ERROR AT 1: ", err);
  //   }

      // SAVE CHANGES:
  // try {
  //   await Promise.all([
  //     page.click(".sf_admin_action_save input"),
  //     page.waitForNavigation(),
  //   ]);
  //   console.log(`Saving was initiated correctly for ${id}`);
  // } catch (err) {
  //   throw new Error(`Error at save-input: ${err}`);
  // }

  // // COPE WITH SAVING-RELATED ERRORS:
  // const hasError = await page.$(".error");
  // if (hasError === null) {
  //   console.log(`No errors were received. Saving was succesful for ${id} !`);
  //   // await browser.close();
  // }
  // if (hasError) {
  //   console.log("Saving was NOT succesfull!");
  //   assetsUnsuccesfullSaving.push(id);
  //   errorList.data.push(id);
  // }
  // console.log("assetsUnsuccesfullSaving:", assetsUnsuccesfullSaving);

}

forDevelopmentTestASingleAsset(
  URL_FOR_USE,
  "14030", // some embeddings
  // "15409",
  // "12742", // zero embeddings
  USERNAME,
  USER_IDENTIFICATION,
  TEXT_FOR_ADDING,
  CHANGE_COMMENTARY
);

// EXPORT THE ABOVE FUNC TO USE IT FROM INDEX-JS:
exports.data = forDevelopmentTestASingleAsset;
