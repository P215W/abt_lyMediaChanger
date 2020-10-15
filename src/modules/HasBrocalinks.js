async function HasBrocalinks(isLab, browser, page, assetId) {
  // open Broca modal:
  await page.click(".js-broca-button");

  // open modal in new tab:
  const modalPage = await browser.newPage();
  if (isLab) {
    await modalPage.goto(
      `https://broca.staging.labamboss.com/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
    );
  } else {
    await modalPage.goto(
      `https://broca.miamed.de/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
    );
  }

  // do stuff within Broca modal:
  const numberOfBrocalinks = await modalPage.$eval(
    ".panel-heading span",
    (span) => parseInt(span.textContent)
  );
  console.log("numberOfBrocalinks: ", numberOfBrocalinks);

  await modalPage.close();

  // close Broca model (by just clicking page elements in the background):
  await page.click("label[for=ly_media_asset_description]");

  const hasBrocalinks = numberOfBrocalinks>0 ? true : false;
  return hasBrocalinks;
}

exports.data = HasBrocalinks;
