async function GetTranslatedText(page, textForTranslation) {
  if (textForTranslation === "") return;
  await page.bringToFront(); // make the tab active
  await page.goto(
    "https://translate.google.com/#view=home&op=translate&sl=de&tl=en"
  );
  await page.type("#source", textForTranslation);

  await page.waitForSelector(".tlid-translation");
  let translatedTextArray = await page.$$eval(
    ".tlid-translation span",
    (spans) => spans.map((singleSpan) => singleSpan.textContent)
  );
  if (translatedTextArray.length === 0) {
    translatedTextArray = await page.$$eval(
      ".result-shield-container span",
      (spans) => spans.map((singleSpan) => singleSpan.textContent)
    );
  }
  // await page.waitForSelector(".result-shield-container span");
  // const translatedTextArray = await page.$$eval(
  //   ".result-shield-container span",
  //   (spans) => spans.map(singleSpan => singleSpan.textContent)
  // );

  console.log("translatedTextArray: ", translatedTextArray);
  const translatedText = translatedTextArray.join(" ").trim();
  console.log("translatedText: ", translatedText);
  return translatedText;
}

exports.data = GetTranslatedText;
