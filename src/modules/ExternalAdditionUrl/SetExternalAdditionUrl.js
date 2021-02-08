async function SetExternalAdditionUrl(page, newUrl) {
  await page.click("#ly_media_asset_external_addition_url");
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type("#ly_media_asset_external_addition_url", newUrl);
}
exports.data = SetExternalAdditionUrl;
