const puppeteer = require("puppeteer");
const errorList = require("../assets/errorList");
const SetToMinimalSaveableStatus = require("./SetToMinimalSaveableStatus");
const CheckAssetUsage = require("./CheckAssetUsage");

async function AddTextInTitle(
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

  // MAKE A CHANGE COMMENT IN THE INTERNAL COMMENT FIELD (FOR LATER CHECK AND SEARCHABILITY):
  await page.type("#ly_media_asset_cmt", `${CHANGE_COMMENTARY} \n`);

  CheckAssetUsage.data(page);

  // GET ACCESS TO TEXT FROM IMAGE DESCRIPTION:
  let currentText;
  try {
    const element = await page.$("#ly_media_asset_title");
    currentText = await page.evaluate((element) => element.value, element); // .value returns string type (with html tags)
  } catch (err) {
    throw new Error(
      `Error at part about getting the html-string from the title: ${err}`
    );
  }

  // ADDS TEXT IN TITLE AT THE BEGINNING:
  console.log("currentText: ", currentText);
  const addedText = TEXT_FOR_ADDING;
  const newText = addedText.concat(currentText);
  console.log("newText: ", newText);

  try {
    await page.click("#ly_media_asset_title");

    // MARKING ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");

    // SET TITLE TO NEW (=ADJUSTED) TEXT:
    await page.type("#ly_media_asset_title", `${newText}`);
  } catch (err) {
    throw new Error(`Error at text-overwriting part: ${err}`);
  }

  // JUST FOR TESTING ERRORS: can be removed afterwards
  // if (id === 13636)
  // await page.select("#ly_media_asset_external_addition_type", "smartzoom");

  // SETS ASSETS WITH A NON-SAVEABLE STATUS OF 0% TO 10% STATUS:
  await SetToMinimalSaveableStatus.data(page);

  // MAKE A CHANGE COMMENT FOR THE CHANGE LOG:
  await page.type("#ly_media_asset_change_cmt", `${CHANGE_COMMENTARY}`);

  // SAVE CHANGES:
  try {
    await Promise.all([
      page.click(".sf_admin_action_save input"),
      page.waitForNavigation(),
    ]);
    console.log(`Saving was initiated correctly for ${id}`);
  } catch (err) {
    throw new Error(`Error at save-input: ${err}`);
  }

  // COPE WITH SAVING-RELATED ERRORS:
  const hasError = await page.$(".error");
  if (hasError === null) {
    console.log(`No errors were received. Saving was succesful for ${id} !`);
    // await browser.close();
  }
  if (hasError) {
    console.log("Saving was NOT succesfull!");
    assetsUnsuccesfullSaving.push(id);
    errorList.data.push(id);
  }
  console.log("assetsUnsuccesfullSaving:", assetsUnsuccesfullSaving);

  // await browser.close();
}

// EXPORT THE ABOVE FUNC TO USE IT FROM INDEX-JS:
exports.data = AddTextInTitle;
