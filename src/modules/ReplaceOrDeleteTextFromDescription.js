const puppeteer = require("puppeteer");
const errorList = require("../assets/errorList");

async function ReplaceOrDeleteTextFromDescription(
  URL_FOR_USE,
  id,
  USERNAME,
  USER_IDENTIFICATION,
  DISCLAIMER_TEXT_FOR_REMOVAL,
  CHANGE_COMMENTARY
) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  const assetsUnsuccesfullSaving = [];

  await page.goto(`${URL_FOR_USE}ly_media_asset/${id}/edit`);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

  // MAKE A CHANGE COMMENT IN THE INTERNAL COMMENT FIELD (FOR LATER CHECK AND SEARCHABILITY):
  await page.type("#ly_media_asset_cmt", `${CHANGE_COMMENTARY} \n`);

  // ADD TEXT IN IMAGE DESCRIPTION:
  // try {
  //   await page.click("#cke_17");
  //   await page.type(
  //     "#cke_1_contents textarea",
  //     "Click on the microscope icon (at the top) to view the entire specimen through a virtual microscope."
  //   );
  // } catch (err) {
  //   throw new Error(`Error at clicking part: ${err}`);
  // }

  // try removing texts
  let text;
  try {
    // const text = await page.$eval("#cke_1_contents textarea", async (element) => await element.textContent);  // try textContent

    // const element = await page.$('label[for="ly_media_asset_description"]');   // exp : Description   // WORKS!
    const element = await page.$("#ly_media_asset_description");
    text = await page.evaluate((element) => element.textContent, element); //   returns string type (with html tags)
  } catch (err) {
    throw new Error(`Error at part about getting the html-string from the image description: ${err}`);
  }
  let newText;
  // for adding texts at the bottom of description:
  // const additionTextAtTheEnd = "<p>This should be the only paragraph!</p>";
  // newText = text.concat(additionTextAtTheEnd);
  // for removing texts:
  newText = text.replace(`${DISCLAIMER_TEXT_FOR_REMOVAL}`, "");

  // ADD TEXT IN IMAGE DESCRIPTION-2:
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

  // JUST FOR TESTING ERRORS: can be removed afterwards
  // if (id === 13636)
    // await page.select("#ly_media_asset_external_addition_type", "smartzoom");

  // MAKE A CHANGE COMMENT FOR THE CHANGE LOG:
  await page.type("#ly_media_asset_change_cmt", `${CHANGE_COMMENTARY}`);

  // SAVE CHANGES:
  try {
    await Promise.all([
      page.click(".sf_admin_action_save input"),
      page.waitForNavigation(),
    ]);
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
// FOR HAPPY CASE:
// ReplaceOrDeleteTextFromDescription(5806);
// FOR ERROR CASE:
// ReplaceOrDeleteTextFromDescription(13628);

// EXPORT THE ABOVE FUNC TO USE IT FROM INDEX-JS:
exports.data = ReplaceOrDeleteTextFromDescription;
