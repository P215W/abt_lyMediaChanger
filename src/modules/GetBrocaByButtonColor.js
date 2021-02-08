async function GetBrocaByButtonColor(page) {
  const brocaColor = await page.$eval(".js-broca-button", (element) => {
    console.log(element.style);
    return element.style.backgroundColor;
  });

  let buttonColorTranslated;
  switch (brocaColor) {
    case "rgb(82, 230, 82)":
      buttonColorTranslated = "green";
      break;
    case "rgb(240, 202, 202)":
      buttonColorTranslated = "red";
      break;
    default:
      buttonColorTranslated = "UNKNOWN";
      break;
  }

  const hasBrocalink = buttonColorTranslated === "red" ? false : true;

  return { buttonColorTranslated, hasBrocalink };
}

exports.data = GetBrocaByButtonColor;
