async function SetIllustration(page, illustrationType1, illustrationType2) {
  await page.type(
    "#ly_media_asset_tags_list_Illustration_chzn input",
    `${illustrationType1}` // for example: pass in string "Illustration" for Bild: Illustration (important thing is that String must lead to only 1 search result with select dropdown menu, have to use typing here, since for whatever reason select + value does not work)
  );
  await page.keyboard.press("Enter");

  await page.type(
    "#ly_media_asset_tags_list_Illustration_chzn input",
    `${illustrationType2}`
  );
  await page.keyboard.press("Enter");
}
exports.data = SetIllustration;
