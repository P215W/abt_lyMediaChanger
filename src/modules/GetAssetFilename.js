async function GetAssetFilename(page) {
  const assetFilename = await page.$eval(
    "#ly_media_asset_filename",
    (element) => element.value
  );
  return assetFilename;
}

exports.data = GetAssetFilename;
