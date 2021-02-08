async function SetRawMediaID(page, rawMediaId) {
  await page.type("#ly_media_asset_rawmediaid", rawMediaId);
}
exports.data = SetRawMediaID;
