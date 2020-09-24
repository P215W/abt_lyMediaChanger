async function AddTagForVisibility(page, tag) {
  await page.type("#ly_media_asset_tags_list_ablauf_chzn input", tag);
  await page.keyboard.press("Enter");
  return;
}

exports.data = AddTagForVisibility;
