async function GetRawMediaID(page) {
  return await page.$eval("#ly_media_asset_rawmediaid", (input) => input.value);
}

exports.data = GetRawMediaID;
