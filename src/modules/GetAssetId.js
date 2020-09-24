async function GetAssetId(page) {
  const stringWithId = await page.$eval(
    "#sf_admin_container h1",
    (element) => element.innerHTML
  );
  return stringWithId.substring(16, stringWithId.length - 1); // Extracts number aka. asset id from the string
}

exports.data = GetAssetId;
