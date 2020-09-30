const xlsx = require("xlsx");

async function PutArrayIntoSpreadsheet(array, workbookName, worksheetName) {
  const arr = array;
  const newWB = xlsx.utils.book_new();
  const newWS = xlsx.utils.json_to_sheet(arr);

  xlsx.utils.book_append_sheet(newWB, newWS, worksheetName);
  xlsx.writeFile(newWB, `../lists/${workbookName}.xlsx`);
}

exports.data = PutArrayIntoSpreadsheet;
