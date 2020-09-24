async function GetTitle(page) {
  const title = await page.$eval(
    "#ly_media_asset_title",
    (element) => element.value
  );
  return title;
};

exports.data = GetTitle;
