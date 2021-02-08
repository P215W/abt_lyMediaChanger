const puppeteer = require("puppeteer");
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const SetToMinimalSaveableStatus = require("./SetToMinimalSaveableStatus");
const GetTitle = require("./Title/GetTitle");
const GetDescription = require("./GetDescription");
const GetAuthorResponsible = require("./GetAuthorResponsible");
const DownloadAsset = require("./DownloadAsset");
const GetAssetFilename = require("./GetAssetFilename");
const SetTitle = require("./Title/SetTitle");
const AddTextInInternalCommentary = require("./AddTextInInternalCommentary");
const GetTranslatedText = require("./GetTranslatedText");
const GetAssetId = require("./GetAssetId");
const GetBrocaByButtonColor = require("./GetBrocaByButtonColor");
const SetNewBrocalink = require("./SetNewBrocalink");
const SetTextInDescription = require("./SetTextInDescription");

// CONST's (hardcoded variables):
const IS_RE_RUN_FROM_LAST_SUCCESS_AT = null; // default value: null; In case of errors, this should equal the last successfully saved asset id (as string type!, e.g. "11174")
const LYMEDIA_SEARCH_TITLE = null;
const LYMEDIA_SEARCH_DESCRIPTION = null;
const LYMEDIA_SEARCH_AUTHOR = null;
const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = null;
const LYMEDIA_SEARCH_REQUIRE_TAGS = null;
const LYMEDIA_SEARCH_EXCLUDE_TAGS = null;

async function Brocarize(
  assetURL,
  isLab,
  IS_ENVIRONMENT_EN,
  USERNAME,
  USER_IDENTIFICATION,
  CHANGE_COMMENTARY,
  NEXT_EDITOR
) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(200000);

  await page.goto(`${assetURL}`);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

  const assetId = await GetAssetId.data(page);
  // checks for brocalinks:

  const { buttonColorTranslated, hasBrocalink } = await GetBrocaByButtonColor.data(page);
  console.log("buttonColorTranslated: ", buttonColorTranslated);
  console.log("hasBrocalink: ", hasBrocalink);
  if (hasBrocalink) {
    // closes all tabs for the brocarization process:
    await browser.close();
    return "alreadyBrocarized true";
  }

  const title = await GetTitle.data(page);
  if (title === "") {
    // closes all tabs for the brocarization process:
    await browser.close();
    return "isBrocarizable false";
  }

  await DownloadAsset.data(page); // downloads asset's image
  const assetFilename = await GetAssetFilename.data(page);
  const originalAssetId = await GetAssetId.data(page);
  const authorResponsible = await GetAuthorResponsible.data(page);
  const description = await GetDescription.data(page);
  let descriptionWithoutHTMLTags = "";
  if (description) {
    descriptionWithoutHTMLTags = description.replace(/<p>|<\/p>|<br>/g, "");
  }
  console.log("descriptionWithoutHTMLTags: ", descriptionWithoutHTMLTags);

  // translates title:
  const page2 = await browser.newPage(); // opens new tab
  let translatedTitle = await GetTranslatedText.data(page2, title);
  if (!translatedTitle) {
    translatedTitle = "";
  }
  console.log("translatedTitle: ", translatedTitle);

  // translates description:
  // const page3 = await browser.newPage();
  // // let translatedDescription = await GetTranslatedText.data(page3, description);
  // let translatedDescription = await GetTranslatedText.data(page3, descriptionWithoutHTMLTags);

  // if (!translatedDescription) {
  //   translatedDescription = "";
  // }
  // newTranslatedDescription = translatedDescription
  //   .replace(/<p>|<\/p>/g, "")
  //   .replace(/<br>/g, "\n")
  //   .trim();
  // console.log("newTranslatedDescription: ", newTranslatedDescription);

  await page.bringToFront(); // makes the initial ribosome asset's tab active again

  // Creates the copy in another language, aka. brocarizing the asset:
  const newPagePromise = new Promise((x) =>
    browser.once("targetcreated", (target) => x(target.page()))
  );
  await page.click("[value='Create Copy in other language']");
  // handle Page 2: you can access new page DOM through newPage object
  const newPage = await newPagePromise;
  newPage.setDefaultNavigationTimeout(200000);
  await newPage.waitForSelector("#signin_username");
  await newPage.type("#signin_username", `${USERNAME}`); // cred
  await newPage.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([
    newPage.click("tfoot input"),
    newPage.waitForNavigation(),
  ]);

  // SETS TRANSLATED TITLE:
  await SetTitle.data(newPage, "replace", translatedTitle, title);

  // uploads original image from path, file picker:
  try {
    const [fileChooser] = await Promise.all([
      newPage.waitForFileChooser(),
      newPage.click("#ly_media_asset_filename"), // button that triggers file selection
    ]);
    await fileChooser.accept([`C:/Users/Marc/Downloads/${assetFilename}`]);
  } catch (err) {
    throw new Error(`Error at file picker: ${err}`);
  }

  // puts text into internal commentary of new asset as helpful meta data for later editorial process:
  const titleData = `Original untranslated title:\t"${title}"\nAuto-translated title:\t\t"${translatedTitle}"`;
  const descriptionData = `Original untranslated description:\t"${descriptionWithoutHTMLTags}"\n`;
  const textForInternalCommentary = `ID of the original brocarized asset: ${originalAssetId}\n\n${titleData}\n\n${descriptionData}\n---------\n\n`;
  await AddTextInInternalCommentary.data(newPage, textForInternalCommentary);

  // deletes the by-broca-autotransferred image description (which is of course untranslated), cuz instead we did put both, the untranslated and the translated description into the internal commentary via the above code lines:
  await SetTextInDescription.data(newPage, "");

  // SETS AUTHOR_RESPONSIBLE TO THE ONE FROM THE ORIGINAL ASSET:
  await newPage.type("#ly_media_asset_owner_id_chzn input", authorResponsible);
  await newPage.keyboard.press("Enter");

  // SETS NEXT_EDITOR TO A PREDEFINED/HARDCODED ONE:
  // await newPage.type("#ly_media_asset_next_editor_id_chzn input", NEXT_EDITOR);
  // await newPage.keyboard.press("Enter");

  // SETS ASSETS WITH A NON-SAVEABLE STATUS OF 0% (which e.g., some impp assets have) TO 1% STATUS:
  await SetToMinimalSaveableStatus.data(newPage, 1);

  // SAVING PROCEDURE / SAVES CHANGES:
  try {
    await Promise.all([
      newPage.click(".sf_admin_action_save input"),
      newPage.waitForNavigation(),
    ]);
    console.log(`Saving was initiated correctly for ${assetURL}`);
  } catch (err) {
    throw new Error(`Error at save-input: ${err}`);
  }
  // // COPE WITH SAVING-RELATED ERRORS:
  // const hasError = await newPage.$(".error");
  // if (hasError === null) {
  //   console.log(`No errors were received. Saving was succesful for ${id} !`);
  //   // await browser.close();
  // }
  // if (hasError) {
  //   console.log("Saving was NOT succesfull!");
  //   assetsUnsuccesfullSaving.push(id);
  //   errorList.data.push(id);
  // }

  // gets new asset id:
  const newAssetId = await GetAssetId.data(newPage);

  // opens broca modal from the newly saved asset and sets the broca link to the original asset
  await SetNewBrocalink.data(
    isLab,
    IS_ENVIRONMENT_EN,
    browser,
    newAssetId,
    title,
    assetId
  );

  // closes all tabs for the brocarization process:
  // await browser.close();

  return "autoBrocarized TRUE";
}

exports.data = Brocarize;
