async function GetTranslatedText(page, textForTranslation) {
  if (textForTranslation === "") return;
  await page.bringToFront(); // make the tab active
  await page.goto(
    "https://translate.google.com/#view=home&op=translate&sl=de&tl=en"
  );

  //not working atm:
  // await page.type("#source", textForTranslation);
  // working: 
  await page.type(".QFw9Te textarea", textForTranslation);

  await page.waitForSelector(".ChMk0b span");
  // not working atm:
  // let translatedTextArray = await page.$$eval(
  //   ".tlid-translation span",
  //   (spans) => spans.map((singleSpan) => singleSpan.textContent)
  // );
  // trial:
  let translatedTextArray = await page.$eval(
    ".ChMk0b span",
    (span) => span.textContent);
  // if (translatedTextArray.length === 0) {
  //   translatedTextArray = await page.$$eval(
  //     ".result-shield-container span",
  //     (spans) => spans.map((singleSpan) => singleSpan.textContent)
  //   );
  // }

  // await page.waitForSelector(".result-shield-container span");
  // const translatedTextArray = await page.$$eval(
  //   ".result-shield-container span",
  //   (spans) => spans.map(singleSpan => singleSpan.textContent)
  // );

  console.log("translatedTextArray: ", translatedTextArray);
  // const translatedText = translatedTextArray.join(" ").trim();
  const translatedText = translatedTextArray;
  console.log("translatedText: ", translatedText);
  return translatedText;
}

exports.data = GetTranslatedText;
