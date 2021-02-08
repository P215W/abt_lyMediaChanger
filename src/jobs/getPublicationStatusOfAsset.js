const puppeteer = require("puppeteer");
const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetUsageHasOneSpecificEmbedding = require("../modules/GetUsageHasOneSpecificEmbedding");
const GetUsageListForOneSpecificEmbedding = require("../modules/GetUsageListForOneSpecificEmbedding");
const GetAssetFilename = require("../modules/GetAssetFilename");
const GetTitle = require("../modules/Title/GetTitle");

// CONST's (hardcoded variables):
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;

(async (assetURL) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(200000);

  await page.goto(`${assetURL}`);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

  const hasArticleUsage = await GetUsageHasOneSpecificEmbedding.data(
    page,
    "Articles with this image"
  );
  console.log("hasArticleUsage: ", hasArticleUsage);

  if (hasArticleUsage) {
    // gets filename and title:
    const assetFilename = await GetAssetFilename.data(page);
    const fullFileName = `https://media-us.amboss.com/media/thumbs/big_${assetFilename}`;
    const title = await GetTitle.data(page);
    console.log("title: ", title);

    // gets article list:
    const articleList = await GetUsageListForOneSpecificEmbedding.data(
      page,
      "Articles with this image"
    );
    console.log("articleList: ", articleList);

    // loop through article list like that:
    for (let articleId of articleList) {
      const pageArticle = await browser.newPage(); // opens new tab
      pageArticle.setDefaultNavigationTimeout(200000);
      await pageArticle.goto(
        // opens LC in ribosome
        `https://ribosom-us.miamed.de/learningcard/edit/${articleId}`
      );

      // checks if LC has a button called "Amboss published version" -> if yes: go on, if not: continue in loop:
      let publishedButtonLink;
      try {
        publishedButtonLink = await pageArticle.$eval(
          'a[title="AMBOSS current published version in new window"]',
          (elem) => elem.href
        );
        console.log("publishedButtonLink: ", publishedButtonLink);
      } catch (err) {
        console.log("No published-button present/article offline. " + err);
        continue; // if not button present, card is offline and we want to continue with loop
      }

      // published button is present and we can move on with the publication status check:
      await pageArticle.goto(publishedButtonLink);
      const publishedButtonLinkArr = publishedButtonLink.split("#xid=");
      await pageArticle.goto(`https://next.amboss.com/us/article/${publishedButtonLinkArr[1]}`);

      await pageArticle.type("#signin_username", `${USERNAME}`); // cred
      await pageArticle.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
      await Promise.all([
        pageArticle.click(".amboss-lastrow input"),
        pageArticle.waitForNavigation(),
      ]);

      await pageArticle.waitFor(2000);
      console.log("Wait is Over!!!");

      await pageArticle.click('button[data-e2e-test-id="show-hide-sections-button"]');
      await pageArticle.waitForSelector(".thumbnail__image");

      await pageArticle.waitFor(8000);

      // in LC look for:
    //   const imgs = await pageArticle.$$eval(".thumbnail__image img", (img) => {
    //         console.log("img: ", img);
    //         return img;
    //   });
    //   console.log("imgs: ", imgs);

    // WORKS!!!
    const imageTitles = await pageArticle.$$eval(
        '.thumbnail__image img',
        (imgs) => imgs.map((img) => img.title)  // textContent // value // innerText // innerHTML
      );
   console.log("imageTitles: ", imageTitles);

   const dataValues = await pageArticle.$$eval(
    '.thumbnail__image',
    spans => spans.map(span => span.dataset.source)
);
console.log("dataValues: ", dataValues);


      const isAssetPublishedDepOnTitle = imageTitles.includes(title); // true or false
      console.log("isAssetPublishedDepOnTitle: ", isAssetPublishedDepOnTitle);
      const isAssetPublishedDepOnFile = dataValues.includes(fullFileName); // true or false
      console.log("isAssetPublishedDepOnFile: ", isAssetPublishedDepOnFile);
      // if (isAssetPublished) return "asset is published";
    }
  } else return;

  // await page.bringToFront(); // makes the initial ribosome asset's tab active again

  // Creates the copy in another language, aka. brocarizing the asset:
  const newPagePromise = new Promise((x) =>
    browser.once("targetcreated", (target) => x(target.page()))
  );
  await page.click("[value='Create Copy in other language']");
  // handle Page 2: you can access new page DOM through newPage object
  const newPage = await newPagePromise;
  newPage.setDefaultNavigationTimeout(200000);
  await newPage.waitForSelector("#signin_username");
  await newPage.type("#signin_username", `${USERNAME}`); // cred
  await newPage.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([
    newPage.click("tfoot input"),
    newPage.waitForNavigation(),
  ]);

  // SAVING PROCEDURE / SAVES CHANGES:
  //   try {
  //     await Promise.all([
  //       newPage.click(".sf_admin_action_save input"),
  //       newPage.waitForNavigation(),
  //     ]);
  //     console.log(`Saving was initiated correctly for ${assetURL}`);
  //   } catch (err) {
  //     throw new Error(`Error at save-input: ${err}`);
  //   }
  // // COPE WITH SAVING-RELATED ERRORS:
  // const hasError = await newPage.$(".error");
  // if (hasError === null) {
  //   console.log(`No errors were received. Saving was succesful for ${id} !`);
  //   // await browser.close();
  // }
  // if (hasError) {
  //   console.log("Saving was NOT succesfull!");
  //   assetsUnsuccesfullSaving.push(id);
  //   errorList.data.push(id);
  // }

  // closes all tabs for the brocarization process:
  // await browser.close();
})("https://ribosom-us.miamed.de/ly_media_asset/12293/edit");
// https://ribosom-us.miamed.de/ly_media_asset/13626/edit  // <- 1 article w/o publish button!
// https://ribosom-us.miamed.de/ly_media_asset/12293/edit // <- 1 article
// https://ribosom-us.miamed.de/ly_media_asset/10511/edit // <- with 2 articles


// TO DO / Fix me:
// - fix next url issue
// - put code in try block to avoid scoping malpractices wuth let