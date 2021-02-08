const puppeteer = require("puppeteer");
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetUsageHasOneSpecificEmbedding = require("../modules/GetUsageHasOneSpecificEmbedding");
const GetUsageHasAnyEmbedding = require("../modules/GetUsageHasAnyEmbedding");
const GetAssetId = require("../modules/GetAssetId");
const GetRawMediaID = require("../modules/RawMediaID/GetRawMediaID");
const SetRawMediaID = require("../modules/RawMediaID/SetRawMediaID");
const SetBildtyp = require("../modules/Bildtyp/SetBildtyp");
const SetIllustration = require("../modules/Illustration/SetIllustration");

// CONST's (hardcoded variables):
const IS_RE_RUN_FROM_LAST_SUCCESS_AT = null; // default value: null; In case of errors, this should equal the last successfully saved asset id (as string type!, e.g. "11174")
const URL_FOR_USE = process.env.BASE_URL_PROD_DE;
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

  // await page.click(".js-broca-button");
  // await page.click("label[for=ly_media_asset_description]");

  const assetId = await GetAssetId.data(page);

  // "bild:Illustration=Schema"); // , "bild:Illustration=Realistische Darstellung");

  const currentRawMediaId = await GetRawMediaID.data(page);
  console.log("rawMediaId: ", currentRawMediaId);
  console.log("TYPE rawMediaId: ", typeof currentRawMediaId);
  console.log("length rawMediaId: ", currentRawMediaId.length);

  if (currentRawMediaId.length === 0) {
    await SetRawMediaID.data(page, "0;");
  }

  await page.type("#ly_media_asset_title", "test124");

  await SetBildtyp.data(page, "Illustration");
  await SetIllustration.data(page, "Schema", "Realistische Darstellung");

  const divCount = await page.$$eval("div", (divs) => divs);
  // console.log(divCount);

  const isAssetUsedInArticles = await GetUsageHasOneSpecificEmbedding.data(
    page,
    "Articles with this image"
  );
  console.log("isAssetUsedInArticles: ", isAssetUsedInArticles);
  const isAssetUsed = await GetUsageHasAnyEmbedding.data(page);
  console.log("isAssetUsed: ", isAssetUsed);

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
  // "14030", // some embeddings
  // "15382", // zero
  "6366", // some
  // "12742", // zero embeddings
  // "15607",
  USERNAME,
  USER_IDENTIFICATION,
  TEXT_FOR_ADDING,
  CHANGE_COMMENTARY
);

// EXPORT THE ABOVE FUNC TO USE IT FROM INDEX-JS:
exports.data = forDevelopmentTestASingleAsset;
