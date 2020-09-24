async function GetTextInInternalCommentary(page) {
  // GET ACCESS TO TEXT FROM IMAGE DESCRIPTION:
  let currentText;
  try {
    const element = await page.$("#ly_media_asset_cmt");
    currentText = await page.evaluate((element) => element.value, element); // .value returns string type (with html tags)
  } catch (err) {
    throw new Error(
      `Error at part about getting the html-string from the title: ${err}`
    );
  }
  return currentText;
}

exports.data = GetTextInInternalCommentary;
