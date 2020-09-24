async function SetAuthorResponsible(page, author) {
  //     await page.click("#ly_media_asset_owner_id");

  //   // for multiple-select dropdowns (typable select-elements)
  //   await page.type(
  //     "#ly_media_asset_owner_id", `${author}`
  //   );
  //   await page.keyboard.press('Enter');
  console.log("author", author);
  await page.select("#ly_media_asset_owner_id", `${158595}`);

//   await page.type("#", "Hannes Rössler");
//   await page.keyboard.press("Enter");
}

exports.data = SetAuthorResponsible;
