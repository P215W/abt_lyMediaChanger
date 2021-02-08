async function SetSourceAuthorLink(page, newSourceAuthorLink) {
  await page.click("#ly_media_asset_CopyrightForm_original_author_link");
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type(
    "#ly_media_asset_CopyrightForm_original_author_link",
    newSourceAuthorLink
  );
}
exports.data = SetSourceAuthorLink;
