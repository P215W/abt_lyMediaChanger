// Imports:
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");
const mscEntityArrays = require("../assets/mscEntityArrays");

// Constants:
const SPREADSHEET_NAME = "Maxi MD images EN";    // current spreadsheet (spr.) name
const WORKSHEET_NAME = "Maxi MD images EN" // meaning "Reiter" of current spr.
const PROPERTY_TO_FILTER_FOR = "isUsed";
const NEW_SPREADSHEET_NAME = "Filtered Maxi MD images EN"; // supposed new spr. name
const NEW_WORKSHEET_NAME = "Filtered Maxi MD images EN";

console.log(mscEntityArrays.data.articleArray);

// Get data:
const spreadsheetData = GetSpreadsheetData.data(SPREADSHEET_NAME, WORKSHEET_NAME);
// console.log("spreadsheetData: " , spreadsheetData);

// Filter data: (at 19.12min yt)
const interimData = spreadsheetData.map(object => {

    if (object.isEmbedded === false) {
        object.questionList = "-";
        object.caseList = "-";
        object.comparisonImageList = "-";
        object.phrasionaryList = "-";
        object.articleList = "-";
    }

    const stringToArray = (list) => {
        if (object[list].length > 1) {
            object[list] = object[list].split("\n");
        }
    };
    stringToArray("questionList");
    stringToArray("comparisonImageList");
    stringToArray("articleList");

    // console.log("object: ", object);
    return object;
});
// console.log("interimData: ", interimData);
const newData = interimData.map(object => {
    // return {
    //     lyMediaLink: object.lyMediaLink,
    //     isProcessed: object.isProcessed,
    //     isEmbedded: object.isEmbedded,
    //     questionList: object.questionList === "-" ? object.questionList : object.questionList.filter(item => !mscEntityArrays.data.questionArray.includes(item)),
    //     caseList: object.caseList,
    //     comparisonImageList: object.comparisonImageList === "-" ? object.comparisonImageList : object.comparisonImageList.filter(item => !mscEntityArrays.data.questionArray.includes(item)),
    //     phrasionaryList: object.phrasionaryList,
    //     articleList: object.articleList === "-" ? object.articleList : object.articleList.filter(item => !mscEntityArrays.data.articleArray.includes(item))
    // };

    if ( typeof(object.articleList) === "object" ) {
        const filteredEntityArray = object.articleList.filter(item => {
            const string = item;
            const str = string.replace(
              "https://ribosom-us.miamed.de/learningcard/edit/",
              ""
            );
            const idNumber = parseInt(str, 10);
            console.log(`Hier aus filter kurzversion: `, idNumber);
            if (mscEntityArrays.data.articleArray.includes(idNumber)) {
                console.log("TREFFER: ", idNumber);
            } else {
                console.log("KEINERRRR: ", idNumber);
                return item;
            }
        });
        console.log("filteredEntityArray: ", filteredEntityArray)
        const arrayToString = filteredEntityArray.join("\n");
        object.articleList = arrayToString;
        console.log("object.articleList: ", object.articleList)
    };

    // repetition form above for questions
    if ( typeof(object.questionList) === "object" ) {
        const filteredEntityArray2 = object.questionList.filter(item => {
            const string = item;
            const str = string.replace(
              "https://ribosom-us.miamed.de/question/editUsmle/",
              ""
            );
            const idNumber = parseInt(str, 10);
            console.log(`Hier aus filter kurzversion: `, idNumber);
            if (mscEntityArrays.data.questionArray.includes(idNumber)) {
                console.log("TREFFER: ", idNumber);
            } else {
                console.log("KEINERRRR: ", idNumber);
                return item;
            }
        });
        console.log("filteredEntityArray2: ", filteredEntityArray2)
        const arrayToString = filteredEntityArray2.join("\n");
        object.questionList = arrayToString;
        console.log("object.questionList: ", object.questionList)
    };
    // rep. qs end
  
    // repettion for part about imageforcomparison questions
    if ( typeof(object.comparisonImageList) === "object" ) {
        const filteredEntityArray3 = object.comparisonImageList.filter(item => {
            const string = item;
            const str = string.replace(
              "https://ribosom-us.miamed.de/question/editUsmle/",
              ""
            );
            const idNumber = parseInt(str, 10);
            console.log(`Hier aus filter kurzversion: `, idNumber);
            if (mscEntityArrays.data.questionArray.includes(idNumber)) {
                console.log("TREFFER: ", idNumber);
            } else {
                console.log("KEINERRRR: ", idNumber);
                return item;
            }
        });
        console.log("filteredEntityArray3: ", filteredEntityArray3)
        const arrayToString = filteredEntityArray3.join("\n");
        object.comparisonImageList = arrayToString;
        console.log("object.comparisonImageList: ", object.comparisonImageList)
    };
    // rep comps end
    return object;
});
console.log("newData: ", newData);


// Create a new spreadsheet with the newData: (at 23.20min yt)
SetSpreadsheetData.data(NEW_SPREADSHEET_NAME, NEW_WORKSHEET_NAME, newData);