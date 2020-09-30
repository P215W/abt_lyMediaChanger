// Imports:
const GetSpreadsheetData = require("../modules/GetSpreadsheetData");
const SetSpreadsheetData = require("../modules/SetSpreadsheetData");

// Constants:
const SPREADSHEET_NAME = "Kopie von 40% Radiology List";    // current spreadsheet (spr.) name
const WORKSHEET_NAME = "40% Radiology list" // meaning "Reiter" of current spr.
const PROPERTY_TO_FILTER_FOR = "isUsed";
const NEW_SPREADSHEET_NAME = "Filtered 40% Radiology List"; // supposed new spr. name
const NEW_WORKSHEET_NAME = "40% Radiology List";

// Get data:
const spreadsheetData = GetSpreadsheetData.data(SPREADSHEET_NAME, WORKSHEET_NAME);
console.log("spreadsheetData: " , spreadsheetData);

// Filter data: (at 19.12min yt)
const newData = spreadsheetData.filter(item => item[PROPERTY_TO_FILTER_FOR] === true);  // if err: maybe this doesnt work because of a) its a string and is capitalized? 
console.log("newData: ", newData);

// Create a new spreadsheet with the newData: (at 23.20min yt)
SetSpreadsheetData.data(NEW_SPREADSHEET_NAME, NEW_WORKSHEET_NAME, newData);