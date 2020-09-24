async function GetDescription(page) {
  let text;
  try {
    // const element = await page.$("#ly_media_asset_description");
    // // text = await page.evaluate((element) => element.textContent, element); //   returns string type (with html tags)
    // text = await page.evaluate((element) => element.textContent, element); //   returns string type (with html tags)
    text = await page.$eval("#ly_media_asset_description", (element) => element.value);
    console.log("text: ", text);
  } catch (err) {
    throw new Error(
      `Error at part about getting the html-string from the image description: ${err}`
    );
  }
  return text;
 
  // const text = await page.$eval("#ly_media_asset_description", (element) => {
  //   console.log("element: ", element);
  // });
  // // console.log("text: ", text);
}

exports.data = GetDescription;
