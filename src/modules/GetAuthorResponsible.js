async function GetAuthorResponsible(page) {
  const title = await page.$eval(
    "#ly_media_asset_owner_id_chzn span",
    (element) => element.textContent
  );
  return title;
};

exports.data = GetAuthorResponsible;
