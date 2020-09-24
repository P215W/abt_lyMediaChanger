async function CheckAssetDimensions(page) {

    await page.type("#ly_media_asset_author", `${author}, `);
  }

  const dimensions = await page.$eval(".", (element) => element.value); // element.textContent
  console.log("dimensions: ", dimensions);
  console.log("type of dimensions: ", typeof(dimensions));

  // if (dimensions.length)
  
  exports.data = CheckAssetDimensions;
  