async function GetExternalAdditionUrl(page) {
  const currentExternalUrl = await page.$eval(
    "#ly_media_asset_external_addition_url",
    (input) => input.value
  );
  return currentExternalUrl;
}
exports.data = GetExternalAdditionUrl;
