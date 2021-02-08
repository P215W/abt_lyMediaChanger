const GetTitle = require("./GetTitle");

async function SetTitle(page, mode, text, textGettingReplaced) {
  const currentTitle = await GetTitle.data(page); // get prevText from title

  let newTitle;
  if (mode === "addFront") {
    const textForAddingFront = text + " ";
    newTitle = textForAddingFront.concat(currentTitle);
  } else if (mode === "addBehind" || mode === undefined) {
    const textForAddingBehind = " " + text;
    newTitle = currentTitle.concat(textForAddingBehind);
  } else if (mode === "replace") {
    newTitle = currentTitle.replace(textGettingReplaced, text);
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
