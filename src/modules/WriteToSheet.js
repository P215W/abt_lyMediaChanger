const xlsx = require("xlsx");

async function WriteToSheet(filename, id) {
  const wb = xlsx.readFile(filename);
  const ws = wb.Sheets["Sheet 1"];
  const data = xlsx.utils.sheet_to_json(ws);
  // console.log("data1: ", data);
  data.push({ lymediaAsset: `basePathToAsset/edit/${id}` });
  // console.log("data2: ", data);
  const newWs = xlsx.utils.json_to_sheet(data);
  const newWb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWb, newWs, "Sheet 1");
  xlsx.writeFile(newWb, `../lists/${filename}`);
}

exports.data = WriteToSheet;
