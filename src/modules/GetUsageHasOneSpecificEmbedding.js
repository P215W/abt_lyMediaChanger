async function GetUsageHasOneSpecificEmbedding(page, embeddingOfInterest) {
  const rawUsageData = await page.$$eval(
    '#sf_fieldset_image_used_in li[style^="list"]',
    (as) => as.map((a) => a.innerText)
  );
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

exports.data = GetUsageHasOneSpecificEmbedding;
