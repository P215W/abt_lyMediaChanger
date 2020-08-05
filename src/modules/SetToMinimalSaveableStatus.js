async function SetToMinimalSaveableStatus(puppeteerPage) {
  let status;
  try {
    const element = await puppeteerPage.$("#ly_media_asset_status");
    status = await puppeteerPage.evaluate((element) => element.value, element);
  } catch (err) {
    throw new Error(`Error at part about getting the status: ${err}`);
  }

  if (status === "0")
    await puppeteerPage.select("#ly_media_asset_status", `${10}`);
}

exports.data = SetToMinimalSaveableStatus;
