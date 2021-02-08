async function DeleteAsset(page, assetUrl) {
  const regexForAdaption = /edit/; // modifies assetUrl to include delete aka post method for deletion instead of edit:
  const newUrlString = assetUrl.replace(regexForAdaption, "delete");

  await page.goto(`${newUrlString}`);
  // await page.waitForNavigation();
  console.log(` - Lymedia asset ${assetUrl} was deleted! - `);
}
exports.data = DeleteAsset;
