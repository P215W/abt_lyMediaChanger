const result = require("dotenv").config({
  // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
  path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
});
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const InitiatePuppPage = require("../modules/InitiatePuppPage");
const GetTitle = require("../modules/Title/GetTitle");
const SetTitle = require("../modules/Title/SetTitle");
const SetInternalCommentary = require("../modules/InternalCommentary/SetInternalCommentary");
const GetUsageHasAnyEmbedding = require("../modules/GetUsageHasAnyEmbedding");
const GetUsageListForOneSpecificEmbedding = require("../modules/GetUsageListForOneSpecificEmbedding");
const SaveAsset = require("../modules/SaveAsset");
const GetRawMediaID = require("../modules/RawMediaID/GetRawMediaID");
const SetRawMediaID = require("../modules/RawMediaID/SetRawMediaID");

// const Brocarize = require("../modules/BrocarizeVersionForWorkingWithATable");

const workbookName = "Maxi MD images lymedia EN 1";
const worksheetName = "Maxi MD images lymedia EN";
const URL_FOR_USE = process.env.BASE_URL_PROD_DE;
const IS_LAB = false;
const IS_ENVIRONMENT_EN = true;
const USERNAME = process.env.USER;
const USER_IDENTIFICATION = process.env.PASS;
const CHANGE_COMMENTARY = "autoset title, ic, whitelist prep";
const STRING_TO_REPLACE_IN_TITLE_EN = "MSC:";
const STRING_TO_REPLACE_IN_TITLE_DE = "MSC:";
const STRING_FOR_IC = null;

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

  // loops through result array (the spreaded one) to do actual brocarization:
  for (let asset of spreadedArray) {
    if (asset.isProcessed === false) {
      // opens asset to perform actions (title, ic, checkUsage for whitelist):

      const { page, browser } = await InitiatePuppPage.data(
        asset.lyMediaLink,
        USERNAME,
        USER_IDENTIFICATION
      );
      const currTitle = await GetTitle.data(page);
      if (!currTitle.includes("MSC")) {
        await SetTitle.data(page, "addFront", STRING_TO_REPLACE_IN_TITLE_EN);
      } else console.log("Already has a PREFIX: ", asset.lyMediaLink);
      // await SetInternalCommentary.data(page, "addFront", STRING_FOR_IC);

      // SETS A MISSING RAWMEDIA-ID TO SIMPLY "0" TO ENABLE SAVING:
      const currentRawMediaId = await GetRawMediaID.data(page);
      if (currentRawMediaId.length === 0) {
        await SetRawMediaID.data(page, "0;");
      }

      const hasAnyUsage = await GetUsageHasAnyEmbedding.data(page);
      if (hasAnyUsage) {
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

        asset.isEmbedded = true;
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
      } else {
        asset.isEmbedded = false;
      }

      asset.isProcessed = true;

      try {
        await SaveAsset.data(page, browser);
      } catch (err) {
        // if error -> throwErr to stop process.
        throw new Error(
          `Error at SaveAsset for ${asset.lyMediaLink} with following msg: ${err}`
        );
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
    }
  }
  console.log("---- JOB FINISHED ----");
})();
//   {
//   lyMediaLink: `${URL_FOR_USE}ly_media_asset/10511/edit`, // pass in an argument here in object format, if you want to test/revist a single asset (or a group of special assets, then as an array of objects?)
//   isProcessed: false,
//   isEmbedded: null,
//   questionList: null,
//   caseList: null,
//   comparisonImageList: null,
//   phrasionaryList: null,
//   articleList: null,
// }
