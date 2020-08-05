// require's:
const makeLyMediaList = require("../modules/MakeLyMediaList");
const replaceOrDeleteTextFromDescription = require("../modules/ReplaceOrDeleteTextFromDescription");
const errorList = require("../assets/errorList");

// CONST's (hardcoded variables):
const URL_FOR_USE = "";
const IS_ENVIRONMENT_US = true;
const USERNAME = "";
const USER_IDENTIFICATION = "";

const LYMEDIA_SEARCH_DESCRIPTION =
  "(Virtual microscopy";
const AUTHOR = null;
const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = "smartzoom";
const DISCLAIMER_TEXT_FOR_REMOVAL = "(Virtual microscopy for iOS is currently under development.)";
const CHANGE_COMMENTARY = "autorun_pro_removeMobileDisclFSZ";

// call modules with above CONST'S as their respective arguments:
(async () => {
  // CREATE LIST:
  // const array = [13636, 13635, 13634]; // TEST array
  const array = await makeLyMediaList.data(
    URL_FOR_USE,
    IS_ENVIRONMENT_US,
    USERNAME,
    USER_IDENTIFICATION,
    LYMEDIA_SEARCH_DESCRIPTION,
    AUTHOR,
    LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE,
    LYMEDIA_SEARCH_CHOOSECOPYRIGHTS
  ); // RETURNS AN ARRAY OF ID'S
  console.log("ARR: ", array);
  // PARSE ITEMS:
  for (let item of array) {
    await replaceOrDeleteTextFromDescription.data(
      URL_FOR_USE,
      item,
      USERNAME,
      USER_IDENTIFICATION,
      DISCLAIMER_TEXT_FOR_REMOVAL,
      CHANGE_COMMENTARY
    );
  }
  console.log(
    "---- JOB FINISHED ---- These lyMedia Ids could not be saved and have to be revisited: ",
    errorList.data
  );
})();
