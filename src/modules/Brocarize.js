const puppeteer = require("puppeteer");
const errorList = require("../assets/errorList");
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const SetToMinimalSaveableStatus = require("../modules/SetToMinimalSaveableStatus");
const c = require("../modules/ConsoleLog");
const GetTitle = require("../modules/GetTitle");
const GetDescription = require("../modules/GetDescription");
const GetAuthorResponsible = require("../modules/GetAuthorResponsible");
const DownloadAsset = require("../modules/DownloadAsset");
const GetAssetFilename = require("../modules/GetAssetFilename");
const SetTitle = require("../modules/SetTitle");
const AddTextInInternalCommentary = require("../modules/AddTextInInternalCommentary");
const GetTranslatedText = require("../modules/GetTranslatedText");
const GetAssetId = require("./GetAssetId");

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
const CHANGE_COMMENTARY = "autorun_LAB_addbr";
const NEXT_EDITOR = "Marcel Bischoff (MAB)";

async function Brocarize(
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

  // Function calls for testing:

  const brocaColor = await page.$eval(".js-broca-button", (element) => {
    console.log(element.style);
    return element.style.backgroundColor;
  });
  c.log(brocaColor);
  if (brocaColor === "rgb(82, 230, 82)") console.log("success");

  await page.click(".js-broca-button");

  const assetFilename = await GetAssetFilename.data(page); // get assetFilename

  DownloadAsset.data(page); // downloadAssetImage to systems defined download folder

  const originalAssetId = await GetAssetId.data(page);
  console.log("originalAssetId: ", originalAssetId);
  const authorResponsible = await GetAuthorResponsible.data(page); // get AuthorResponsible
  const title = await GetTitle.data(page);
  const description = await GetDescription.data(page);
  console.log("description: ", description);

  // TRANSLATE TEXT (TITLE TEXT IN THIS CASE): // TODO: make this a function mid-term
  const page2 = await browser.newPage(); // open new tab
  // await page2.goto(
  //   "https://translate.google.com/#view=home&op=translate&sl=de&tl=en"
  // );
  // await page2.bringToFront(); // make the tab active
  // await page2.type("#source", title);
  // await page2.waitForSelector(".tlid-translation span");
  // const translatedTitle = await page2.$eval(
  //   ".tlid-translation span",
  //   (element) => element.textContent
  // );
  // c.log(translatedTitle);
  const translatedTitle = await GetTranslatedText.data(page2, title);
  console.log("translatedTitle: ", translatedTitle);

  const page3 = await browser.newPage();
  const translatedDescription = await GetTranslatedText.data(  // if ok, procesd with html dextratcio, esle else : 
    page3,
    // "Test eins zwei drei. Und Test hier auch."
    description
  );
  console.log("translatedDescription: ", translatedDescription);

  await page.bringToFront(); // make the tab active

  const newPagePromise = new Promise((x) =>
    browser.once("targetcreated", (target) => x(target.page()))
  );
  await page.click("[value='Create Copy in other language']");
  // handle Page 2: you can access new page DOM through newPage object  // make bringto ftont alternatively
  const newPage = await newPagePromise;
  await newPage.waitForSelector("#signin_username");
  await newPage.type("#signin_username", `${USERNAME}`); // cred
  await newPage.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([
    newPage.click("tfoot input"),
    newPage.waitForNavigation(),
  ]);

  // SET TRANSLATED TITLE:
  await SetTitle.data(newPage, "replace", translatedTitle);

  // MAKE A CHANGE COMMENT IN THE INTERNAL COMMENT FIELD (FOR LATER CHECK AND SEARCHABILITY):
  // await newPage.type("#ly_media_asset_cmt", `${CHANGE_COMMENTARY} \n`);

  // uploadImage from path:
  // file picker
  try {
    const [fileChooser] = await Promise.all([
      newPage.waitForFileChooser(),
      newPage.click("#ly_media_asset_filename"), // button that triggers file selection
    ]);

    // await fileChooser.accept(["../assets/test.svg"]);
    // await fileChooser.accept([`${localImagePath}`]);
    await fileChooser.accept([`C:/Users/Marc/Downloads/${assetFilename}`]);
  } catch (err) {
    throw new Error(`Error at file picker: ${err}`);
  }

  const brocarizeTag = CHANGE_COMMENTARY;
  const titleData = `Auto-translated title:\t\t"${translatedTitle}"\nOriginal untranslated title:\t"${title}"`;
  const descriptionData = `Auto-translated image description:\t"${translatedDescription}"\nOriginal untranslated description:\t"${description}"`;
  const textForInternalCommentary = `${brocarizeTag}\n\nID of the original brocarized asset: ${originalAssetId}\n\n${titleData}\n\n${descriptionData}\n---------\n\n`;

  await AddTextInInternalCommentary.data(newPage, textForInternalCommentary);

  // choose a predefined next editor:
  // SetAuthorResponsible.data(newPage, "HRR");
  // const options = await newPage.$$eval("#ly_media_asset_owner_id option", options => {
  //   return options.filter(option => {
  //     if (option.innerHTML === "Abigail Williams (ALW)") {
  //       return option.innerHTML;
  //     };
  //  });
  // });
  // console.log("optionHit: ", optionHit);

  // SETS AUTHOR_RESPONSIBLE TO THE ONE FROM THE ORIGINAL ASSET:
  await newPage.type("#ly_media_asset_owner_id_chzn input", authorResponsible);
  await newPage.keyboard.press("Enter");

  // SETS NEXT_EDITOR TO A PREDEFINED/HARDCODED ONE (ALT. CREATE AN ARRAY OF POSSIBLE EDITORS AND ALLOCATE THEM WITH RANDOM-FUNCTION):
  await newPage.type("#ly_media_asset_next_editor_id_chzn input", NEXT_EDITOR);
  await newPage.keyboard.press("Enter");

  // SETS ASSETS WITH A NON-SAVEABLE STATUS OF 0% TO 1% STATUS:
  await SetToMinimalSaveableStatus.data(newPage, 1);

  // JUST FOR TESTING ERRORS: can be removed afterwards
  // if (id === 13636)
  // await page.select("#ly_media_asset_external_addition_type", "smartzoom");

  // SAVE CHANGES -HERE-:
  // try {
  //   await Promise.all([
  //     newPage.click(".sf_admin_action_save input"),
  //     newPage.waitForNavigation(),
  //   ]);
  //   console.log(`Saving was initiated correctly for ${id}`);
  // } catch (err) {
  //   throw new Error(`Error at save-input: ${err}`);
  // }

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
  // console.log("assetsUnsuccesfullSaving:", assetsUnsuccesfullSaving);
}
// FOR HAPPY CASE:
// AddTextInDescription(
//   "https://ribosom-us.labamboss.com/",
//   5806,
//   "mge",
//   "steindia12",
//   "Click on",
//   "Click on the microscope icon (at the top) to view the entire specimen through a virtual microscope.",
//   "autorun_lab_addStandardDisclaimerFSZ"
// );

Brocarize(
  URL_FOR_USE,
  "15320",
  //  "9428",
  // "3468",
  USERNAME,
  USER_IDENTIFICATION,
  TEXT_FOR_ADDING,
  CHANGE_COMMENTARY
);

// EXPORT THE ABOVE FUNC TO USE IT FROM INDEX-JS:
exports.data = Brocarize;
