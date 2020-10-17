async function GetUsageListForOneSpecificEmbedding(page, embeddingOfInterest) {
  const rawUsageData = await page.$$eval(
    '#sf_fieldset_image_used_in li[style^="list"]',
    (as) => as.map((a) => a.innerText)
  );
  // console.log("rawUsageData: ", rawUsageData);

  const stringForEmbeddingOfInterest = rawUsageData.filter((item) =>
    item.includes(embeddingOfInterest)
  ).join(" ");
  // console.log("stringForEmbeddingOfInterest: ", stringForEmbeddingOfInterest);

  const stringForEmbeddingOfInterestArr = stringForEmbeddingOfInterest.split("\n");
  const articleUsageList = stringForEmbeddingOfInterestArr.filter(item => !item.includes("Articles"));
  // console.log("articleUsageList: ", articleUsageList);
  return articleUsageList;


  // gets article list:
  // const str = "2 Articles with with this image\n208\n215";
  // const result1 = str.split("\n");
  // console.log(result1);
  // const result2 = result1.filter((item) => !item.includes("Articles"));
  // console.log(result2);

  const usageDataArray = rawUsageData.map((string) => {
    const endCut = string.search("\n");
    let key;
    if (endCut > 0) {
      key = string.slice(1, endCut).trim();
    } else {
      key = string.slice(1, string.length).trim();
    }
    let stringArray = string.split(" ");
    const value = stringArray.slice(0, 1).join(" ");
    const valueConverted = parseInt(value);
    return { [key]: valueConverted };
  });
  console.log("usageDataArray: ", usageDataArray);

  function hasOneSpecificEmbedding(imageUsageArray, keyOfInterest) {
    for (let object of imageUsageArray) {
      if (Object.keys(object).includes(keyOfInterest)) {
        if (object[keyOfInterest] > 0) return true;
        else return false;
      } else continue;
    }
  }

  return hasOneSpecificEmbedding(usageDataArray, embeddingOfInterest);
}

exports.data = GetUsageListForOneSpecificEmbedding;
