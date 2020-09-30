const xlsx = require("xlsx");

function GetSpreadsheetData(workbookName, worksheetName) {
  const wb = xlsx.readFile(`../lists/${workbookName}.xlsx`);
  const ws = wb.Sheets[worksheetName];
  const dataAsArray = xlsx.utils.sheet_to_json(ws);

  return dataAsArray;
}

exports.data = GetSpreadsheetData;
