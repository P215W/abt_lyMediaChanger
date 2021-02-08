const result = require("dotenv").config({
    // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
    path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
  });
  const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
  const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
  const InitiatePuppPage = require("../modules/InitiatePuppPage");
  const GetUsageListForOneSpecificEmbedding = require("../modules/GetUsageListForOneSpecificEmbedding");
  
  // const Brocarize = require("../modules/BrocarizeVersionForWorkingWithATable");
  
  const workbookName = "0er Assets EN 1";
  const worksheetName = "0er Assets EN";
  const URL_FOR_USE = process.env.BASE_URL_PROD_EN;
  const IS_ENVIRONMENT_EN = true;
  const USERNAME = process.env.USER;
  const USER_IDENTIFICATION = process.env.PASS;
  
  (async (singleAsset) => {
    // here you can pass in a single asset object which is put in first place of the looped-through array, to test/revisit a particular asset of interest (e.g. tatht has special characteristics to test edge cases etc.)
    // gets spreadsheet data:
    const spreadsheetData = await GetSpreadsheetData.data(
      workbookName,
      worksheetName
    );
  
    // spreads into array to not mutate spreadsheetData directly:
    const spreadedArray = [...spreadsheetData];
    if (singleAsset) {
      spreadedArray.unshift(singleAsset);
    }

    const { page, browser } = await InitiatePuppPage.data(
        "https://ribosom-us.miamed.de/ly_media_asset", // prev. was asset.lyMediaLink
        USERNAME,
        USER_IDENTIFICATION
      );

  
    // loops through result array (the spreaded one) to do actual brocarization:
    for (let asset of spreadedArray) {
      if (asset.isProcessed === false) {
        // opens asset to perform actions (title, ic, checkUsage for whitelist):
  
        // outcommented for trial
        // const { page, browser } = await InitiatePuppPage.data(
        //   asset.lyMediaLink,
        //   USERNAME,
        //   USER_IDENTIFICATION
        // );
        await page.goto(asset.lyMediaLink);
  

          const questionList = await GetUsageListForOneSpecificEmbedding.data(
            page,
            "Questions using this as IMPP-image"
          );
          const caseList = await GetUsageListForOneSpecificEmbedding.data(
            page,
            "Cases using this as IMPP-image"
          );
          const comparisonImageList = await GetUsageListForOneSpecificEmbedding.data(
            page,
            "Questions using this as image for comparison"
          );
          const phrasionaryList = await GetUsageListForOneSpecificEmbedding.data(
            page,
            "Phrasionaries using this image"
          );
          const articleList = await GetUsageListForOneSpecificEmbedding.data(
            page,
            "Articles with this image"
          );
  
          asset.questionList = questionList;
          asset.caseList = caseList;
          asset.comparisonImageList = comparisonImageList;
          asset.phrasionaryList = phrasionaryList;
          asset.articleList = articleList;
  
          function arrToURLString(arr, property) {
            let urlPartForEntity;
            switch (property) {
              case "questionList":
                if (IS_ENVIRONMENT_EN)
                  urlPartForEntity = `${URL_FOR_USE}question/editUsmle/`;
                else urlPartForEntity = `${URL_FOR_USE}question/edit/id/`;
                break;
              case "caseList":
                if (IS_ENVIRONMENT_EN)
                  urlPartForEntity = `${URL_FOR_USE}case/edit/id/`;
                else urlPartForEntity = `${URL_FOR_USE}case/edit/id/`;
                break;
              case "comparisonImageList":
                if (IS_ENVIRONMENT_EN)
                  urlPartForEntity = `${URL_FOR_USE}question/editUsmle/`;
                else urlPartForEntity = `${URL_FOR_USE}question/edit/id/`;
                break;
              case "phrasionaryList":
                if (IS_ENVIRONMENT_EN)
                  urlPartForEntity = `${URL_FOR_USE}/phrase/edit/`;
                else urlPartForEntity = `${URL_FOR_USE}/phrase/edit/`;
                break;
              case "articleList":
                if (IS_ENVIRONMENT_EN)
                  urlPartForEntity = `${URL_FOR_USE}learningcard/edit/`;
                else urlPartForEntity = `${URL_FOR_USE}learningcard/edit/`;
                break;
            }
            const newArr = arr.map((assetId) => `${urlPartForEntity}${assetId}`);
            let string;
            if (newArr.length > 0) {
              string = newArr.join("\n");
            } else {
              string = "-";
            }
            return string;
          }
  
          for (let property in asset) {
            if (typeof asset[property] === "object") {
              try {
                asset[property] = arrToURLString(asset[property], property);
              } catch (err) {
                console.log(`${property} is not of type 'object'`);
                continue;
              }
            } else {
              continue;
            }
          }

  
        asset.isProcessed = true;
  
        try {
          await SetSpreadsheetData.data(
            workbookName,
            worksheetName,
            spreadedArray
          );
        } catch (err) {
          throw new Error(
            "Error at overwriting the spreadsheet at SetSpreadsheetData"
          );
        }
  
        console.log(`-- Process done for ${asset.lyMediaLink} --`);

        // outcommented for trial
        // await browser.close();

      }
    }
    console.log("---- JOB FINISHED ----");
  })();
  //   {
  //   lyMediaLink: `${URL_FOR_USE}ly_media_asset/10511/edit`, // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
  //   isProcessed: false,
  //   questionList: null,
  //   caseList: null,
  //   comparisonImageList: null,
  //   phrasionaryList: null,
  //   articleList: null,
  // }
  