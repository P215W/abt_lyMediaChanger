async function HasBrocalinks(isLab, browser, page, assetId, isEnvironmentEN) {
  // open Broca modal:
  await page.click(".js-broca-button");

  // open modal in new tab:
  const modalPage = await browser.newPage();
  modalPage.setDefaultNavigationTimeout(190000);
  // if (isLab) {
  //   await modalPage.goto(
  //     `https://broca.staging.labamboss.com/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
  //   );
  // } else {
  //   await modalPage.goto(
  //     `https://broca.miamed.de/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
  //   );
  // }
  let linkEN;
  let linkDE;
  if (isLab) {
    linkEN = `https://broca.staging.labamboss.com/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`;
    linkDE = `https://broca.staging.labamboss.com/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`;
  } else {
    linkEN = `https://broca.miamed.de/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`;
    linkDE = `https://broca.miamed.de/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`;
  }
  //     await modalPage.goto(
  //       `https://broca.staging.labamboss.com/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`
  //     );
  //   } else {
  //     await modalPage.goto(
  //       `https://broca.staging.labamboss.com/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
  //     );
  //   }
  // } else {
  //   if (!isEnvironmentEN) {
  //     await modalPage.goto(
  //       `https://broca.miamed.de/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`
  //     );
  //   } else {
  //     await modalPage.goto(
  //       `https://broca.miamed.de/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
  //     );
  //   }
  // }

  // check for EN:
  await modalPage.goto(linkEN);
  const numberOfBrocalinksComingFromEN = await modalPage.$eval(
    ".panel-heading span",
    (span) => parseInt(span.textContent)
  );
  console.log("numberOfBrocalinksComingFromEN: ", numberOfBrocalinksComingFromEN);
  await modalPage.close();

  const modalPageDE = await browser.newPage();
  modalPageDE.setDefaultNavigationTimeout(190000);
  // check for DE:
  await modalPageDE.goto(linkDE);
  const numberOfBrocalinksComingFromDE = await modalPageDE.$eval(
    ".panel-heading span",
    (span) => parseInt(span.textContent)
  );
  console.log("numberOfBrocalinksComingFromDE: ", numberOfBrocalinksComingFromDE);
  await modalPageDE.close();

  // close Broca model (by just clicking page elements in the background):
  // await page.click("label[for=ly_media_asset_description]");

  const hasBrocalinks = (numberOfBrocalinksComingFromEN >0 || numberOfBrocalinksComingFromDE >0) ? true : false;
  console.log("hasBrocalinks: ", hasBrocalinks);
  return hasBrocalinks;
}

exports.data = HasBrocalinks;
