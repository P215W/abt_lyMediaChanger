async function GetUsageHasAnyEmbedding(page) {
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

  function hasAnyEmbedding(imageUsageArray) {
    let result = null;
    for (let object of imageUsageArray) {
      let valueArray = Object.values(object);
      if (valueArray[0] > 0) {
        result = true;
        return result;
      } else {
        result = false;
      }
    }
    return result;
  }
  return hasAnyEmbedding(usageDataArray);
}

exports.data = GetUsageHasAnyEmbedding;
