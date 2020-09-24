const xlsx = require("xlsx");

async function PutArrayIntoSpreadsheet(array) {
  const arr = array;
  const newArr = arr.map( id => ({ lymediaAsset: `basePathToAsset/edit/${id}` } ));
  // const newArr = JSON.stringify(arr);
  console.log("newArr: ", newArr);
  const newWB = xlsx.utils.book_new();
  const newWS = xlsx.utils.json_to_sheet(newArr);
  console.log("newWS: ", newWS);
  xlsx.utils.book_append_sheet(newWB, newWS, "New Data");

  xlsx.writeFile(newWB, "../lists/New Data File.xlsx");
}

exports.data = PutArrayIntoSpreadsheet;
