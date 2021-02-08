async function SetInternalCommentary(page, mode, text, textGettingReplaced) {
  
    // GETS TEXT:
    let currentInternalCommentary;
    try {
      const element = await page.$("#ly_media_asset_cmt");
      currentInternalCommentary = await page.evaluate((element) => element.value, element); // .value returns string type (with html tags)
    } catch (err) {
      throw new Error(
        `Error at part about getting the html-string from the title: ${err}`
      );
    }
    console.log("currentInternalCommentary: ", currentInternalCommentary);

    // mode part
    let newInternalCommentary;
    if (mode === "addFront") {
      const textForAddingFront = text + " ";
      newInternalCommentary = textForAddingFront.concat(currentInternalCommentary);
    } else if (mode === "addBehind" || mode === undefined) {
      const textForAddingBehind = " " + text;
      newInternalCommentary = currentInternalCommentary.concat(textForAddingBehind);
    } else if (mode === "replace" && textGettingReplaced) {
      const textThatMustBeReplaced = textGettingReplaced + " ";
      newInternalCommentary = currentInternalCommentary.replace(textThatMustBeReplaced, text);
    }
    console.log("newInternalCommentary: ", newInternalCommentary);
    // mode end
  
    try {
      await page.click("#ly_media_asset_cmt");
  
      // MARKS ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):
      await page.keyboard.down("Control");
      await page.keyboard.press("KeyA");
      await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");
  
      // SETS TITLE TO NEW (=ADJUSTED) TEXT:
      await page.type("#ly_media_asset_cmt", `${newInternalCommentary}`);
    } catch (err) {
      throw new Error(`Error at text-overwriting part: ${err}`);
    }
  
  }
  
  exports.data = SetInternalCommentary;
  