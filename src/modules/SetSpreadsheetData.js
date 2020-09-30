const xlsx = require("xlsx");

async function SetSpreadsheetData(
  workbookName,
  worksheetName,
  dataForSpreadsheet
) {
  const newWb = xlsx.utils.book_new();
  const newWS = xlsx.utils.json_to_sheet(dataForSpreadsheet);
  xlsx.utils.book_append_sheet(newWb, newWS, worksheetName);

  xlsx.writeFile(newWb, `../lists/${workbookName}.xlsx`);
}

exports.data = SetSpreadsheetData;
