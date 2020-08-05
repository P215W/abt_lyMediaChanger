// require's:
const makeLyMediaList = require("../modules/MakeLyMediaList");
const replaceOrDeleteTextFromDescription = require("../modules/ReplaceOrDeleteTextFromDescription");
const errorList = require("../assets/errorList");

// CONST's (hardcoded variables):
const URL_FOR_USE = ""
const IS_ENVIRONMENT_US = true;
const USERNAME = "";
const USER_IDENTIFICATION = "";

const LYMEDIA_SEARCH_DESCRIPTION =
  "Details have been annotated for better understanding.";
const AUTHOR = null;
const LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE = null;
const LYMEDIA_SEARCH_CHOOSECOPYRIGHTS = "smartzoom";
const DISCLAIMER_TEXT_FOR_REMOVAL =
  "Details have been annotated for better understanding.";
const CHANGE_COMMENTARY = "autorun_lab_removeAnnoDisclFSZ";

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
    try {
      await replaceOrDeleteTextFromDescription.data(
        URL_FOR_USE,
        item,
        USERNAME,
        USER_IDENTIFICATION,
        DISCLAIMER_TEXT_FOR_REMOVAL,
        CHANGE_COMMENTARY
      );
    } catch(err) {
      console.log(
        `Error occured at id ${item} with this message: ${err}. So far these lyMedia Ids could not be saved and have to be revisited: ${errorList.data}`
      );
    }
  }
  console.log(
    "---- JOB FINISHED ---- These lyMedia Ids could not be saved and have to be revisited: ",
    errorList.data
  );
})();
