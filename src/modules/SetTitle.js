const GetTitle = require("./GetTitle");

async function SetTitle(page, mode, text) {
  const title = await GetTitle.data(page); // get prevText from title

  let newTitle;
  if (mode === "addFront") {
    const prevTitle = title;
    const textForAddingFront = text + " ";
    newTitle = textForAddingFront.concat(prevTitle);
  } else if (mode === "addBehind" || mode === undefined) {
    const prevTitle = title;
    const textForAddingBehind = " " + text;
    newTitle = prevTitle.concat(textForAddingBehind);
  } else if (mode === "replace") {
    newTitle = text;
  }

  try {
    await page.click("#ly_media_asset_title");

    // MARKING ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");

    // SET TITLE TO NEW (=ADJUSTED) TEXT:
    await page.type("#ly_media_asset_title", `${newTitle}`);
  } catch (err) {
    throw new Error(`Error at text-overwriting part: ${err}`);
  }
}

exports.data = SetTitle;
