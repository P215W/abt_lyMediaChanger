async function SetNewBrocalink(
  isLab,
  isEnvironmentEN,
  browser,
  assetId,
  titleFromOriginalAsset,
  idFromOriginalAsset
) {
  const brocarizationDirection =
    "Info flow from original asset to new asset? - yes"; // change to "... - no" if it should be different
  const BROCARIZATION_DIRECTION =
    brocarizationDirection === "Info flow from original to new - yes"
      ? "inspired by"
      : "template for";

  // opens modal in new tab:
  const modalPage = await browser.newPage();
  if (isLab) {
    if (!isEnvironmentEN) {
      await modalPage.goto(
        `https://broca.staging.labamboss.com/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`
      );
    } else {
      await modalPage.goto(
        `https://broca.staging.labamboss.com/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
      );
    }
  } else {
    if (!isEnvironmentEN) {
      await modalPage.goto(
        `https://broca.miamed.de/list/en/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},en&reduced=`
      );
    } else {
      await modalPage.goto(
        `https://broca.miamed.de/list/de/ly-media-asset?link_filter[fromOrToIdLang]=${assetId},de&reduced=`
      );
    }
  }

  // opens new link setup page:
  await Promise.all([
    modalPage.click("#link-not-found-container a"),
    modalPage.waitForNavigation(),
  ]);

  // on link setup page, following actions are performed:
  await modalPage.select(
    "#multi_link_new_direction",
    `${BROCARIZATION_DIRECTION}`
  ); // chooses brocarization direction as "derived from other asset" aka "inspired by"
  await modalPage.click("#select2-multi_link_new_idForeign-container"); // opens input field by clicking the dropdown in UI
  await modalPage.waitForSelector(".select2-search__field"); // gives time for input field to show up
  await modalPage.type(".select2-search__field", `${titleFromOriginalAsset}`); // types original title to find the asset that the new one was "inspired by"
  await modalPage.waitFor(2700); // gives page some time to find search results for the above title input

  // get the array of results aka asset titles:
  const options = await modalPage.$$eval(
    "#select2-multi_link_new_idForeign-results li",
    (lis) => lis.map((li) => li.innerText)
  );
  console.log("results: ", options);

  // finds index of wanted asset in the array:
  const indexOfSearchedAsset = options.findIndex(
    (option) => option === `${titleFromOriginalAsset} (${idFromOriginalAsset})`
  );
  // clicks the list item with the array+1 number (nth-child), which is the 100% correct asset because it has the correct title AND id
  await modalPage.click(
    `#select2-multi_link_new_idForeign-results li:nth-child(${
      indexOfSearchedAsset + 1
    })`
  );
  await modalPage.click("button[type=submit]"); // clicks save button
}

exports.data = SetNewBrocalink;
