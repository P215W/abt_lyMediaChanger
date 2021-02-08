const puppeteer = require("puppeteer");
const errorList = require("../assets/errorList");
const AddAuthor = require("./AddAuthor");
const SetToMinimalSaveableStatus = require("./SetToMinimalSaveableStatus");

async function AddTextInDescription(
  URL_FOR_USE,
  id,
  USERNAME,
  USER_IDENTIFICATION,
  DECISIVE_STRING_FOR_ADDING,
  DISCLAIMER_TEXT_FOR_ADDING,
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

  // GET ACCESS TO TEXT FROM IMAGE DESCRIPTION:
  let text;
  try {
    const element = await page.$("#ly_media_asset_description");
    text = await page.evaluate((element) => element.textContent, element); //   returns string type (with html tags)
  } catch (err) {
    throw new Error(
      `Error at part about getting the html-string from the image description: ${err}`
    );
  }

  // ADDS ADDITIONAL TEXT AT THE BOTTOM IN THE IMAGE DESCRIPTION:
  const textIsIncluded = text.includes(DECISIVE_STRING_FOR_ADDING);
  let newText = text.concat(`${DISCLAIMER_TEXT_FOR_ADDING}`);
  if (!textIsIncluded) {
    try {
      await page.click("#cke_17");

      // MARKING ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):
      await page.click("#cke_1_contents textarea");
      await page.keyboard.down("Control");
      await page.keyboard.press("KeyA");
      await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");

      // SET TEXTAREA TO NEW (=ADJUSTED) TEXT:
      await page.type("#cke_1_contents textarea", `${newText}`);
    } catch (err) {
      throw new Error(`Error at clicking part: ${err}`);
    }
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
    await browser.close();
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
exports.data = AddTextInDescription;
