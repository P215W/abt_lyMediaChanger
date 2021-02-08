async function AddTextInInternalCommentary(page, text) {
  // await page.type("#ly_media_asset_cmt", text);

  // GET ACCESS TO TEXT:
  let currentText;
  try {
    const element = await page.$("#ly_media_asset_cmt");
    currentText = await page.evaluate((element) => element.value, element); // .value returns string type (with html tags)
  } catch (err) {
    throw new Error(
      `Error at part about getting the html-string from the title: ${err}`
    );
  }

  // ADDS TEXT IN TITLE AT THE BEGINNING:
  console.log("currentText: ", currentText);
  const addedText = text;
  const newText = addedText.concat(currentText);
  console.log("newText: ", newText);

  try {
    await page.click("#ly_media_asset_cmt");

    // MARKING ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):

    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");

    // SET TITLE TO NEW (=ADJUSTED) TEXT:
    await page.type("#ly_media_asset_cmt", `${newText}`);
  } catch (err) {
    throw new Error(`Error at text-overwriting part: ${err}`);
  }


}

exports.data = AddTextInInternalCommentary;
