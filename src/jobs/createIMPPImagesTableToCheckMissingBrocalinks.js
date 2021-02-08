// require's:
const result = require("dotenv").config({
    // in order for this to work: run "node -r dotenv/config your_script.js" for the first time
    path: "C:\\Users\\Marc\\abt_lyMediaChanger\\.env",
  });
  const makeLyMediaList = require("../modules/MakeLyMediaList");
  const errorList = require("../assets/errorList");
  const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
  
  console.log(result);
  
  // CONST's (hardcoded variables):
  const RUN_NUMBER = "1"; // default value: "1"; In case of errors, this should be ascending for each new run, i.e. first rerun would be "2" and so forth
  const URL_FOR_USE = process.env.BASE_URL_PROD_EN;
  const IS_ENVIRONMENT_EN = true;
  const USERNAME = process.env.USER;
  const USER_IDENTIFICATION = process.env.PASS;
  const SPREADSHEET_NAME = "IMPP ImgEN missing brocalink";
  const SPREADSHEET_WORKSHEET_NAME = "IMPP ImgEN missing brocalink"; // for the "Reiter" of a spreadsheet
  
  const LYMEDIA_SEARCH_TITLE = null;
  const LYMEDIA_SEARCH_DESCRIPTION = null;
  const LYMEDIA_SEARCH_AUTHOR = null;
  const LYMEDIA_SEARCH_STATUS = null; // e.g. number type 40 to select 40%
  const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
  const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = "impp";
  const LYMEDIA_SEARCH_REQUIRE_TAGS = null;
  const LYMEDIA_SEARCH_EXCLUDE_TAGS = null;
  
  // call modules with above CONST'S as their respective arguments:
  (async () => {
    const originalArray = await makeLyMediaList.data(
      URL_FOR_USE,
      IS_ENVIRONMENT_EN,
      USERNAME,
      USER_IDENTIFICATION,
      LYMEDIA_SEARCH_TITLE,
      LYMEDIA_SEARCH_DESCRIPTION,
      LYMEDIA_SEARCH_AUTHOR,
      LYMEDIA_SEARCH_STATUS,
      LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE,
      LYMEDIA_SEARCH_CHOOSECOPYRIGHTS,
      LYMEDIA_SEARCH_REQUIRE_TAGS,
      LYMEDIA_SEARCH_EXCLUDE_TAGS
    ); // RETURNS AN ARRAY OF ID'S
  
    const dataForTable = originalArray.map(item => {
      return {
        lyMediaLink: `${URL_FOR_USE}ly_media_asset/${item}/edit`,
        isChecked: false,
        brocaButtonColor: null,
        hasBrocalink: null,
      };
    });
  
    // only for very first run to create initial spreadsheet:
    await SetSpreadsheetData.data(
      `${SPREADSHEET_NAME} ${RUN_NUMBER}`,
      `${SPREADSHEET_WORKSHEET_NAME}`,
      dataForTable
    );
  
    console.log(
      "---- JOB FINISHED ---- These lyMedia Ids could not be saved and have to be revisited: ",
      errorList.data
    );
  })();
  