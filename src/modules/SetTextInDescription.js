async function SetTextInDescription(page, textToInsert) {
    try {
        await page.click("#cke_17");
  
        // MARKING ALL TEXT AND DELETING IT (SO THAT WE CAN ADD IN OUR NEW TEXT):
        await page.click("#cke_1_contents textarea");
        await page.keyboard.down("Control");
        await page.keyboard.press("KeyA");
        await page.keyboard.up("Control");
        await page.keyboard.press("Backspace");
  
        // SET TEXTAREA TO NEW (=ADJUSTED) TEXT:
        await page.type("#cke_1_contents textarea", `${textToInsert}`);
      } catch (err) {
        throw new Error(`Error at clicking part: ${err}`);
      }
}

exports.data = SetTextInDescription;