const createMarcsPathoList = require("./createMarcsPathoList");
const useMarcsPathoList = require("./useMarcsPathoList");

const MICRO_IMAGE_TAG = "bild:bildtyp=Mikroskopie";
const MACRO_IMAGE_TAG = "bild:Foto=Makroskopische Pathologie";

const ORGAN_TAG_SCHILDDRÜSE = "medizin:organsystem=Schilddrüse und Nebenschilddrüse";
const ORGAN_TAG_LUNGE = "medizin:organsystem=Lunge und Atemwege";

async function pathoImage(imageType, tissueType) {
  // imageType should be "ma" for macro, or "mi" for micro
  console.log("the arguments passed in: " + imageType + " " + tissueType);
  let imageTypeForSearch;
  if (imageType === "mi") imageTypeForSearch = MICRO_IMAGE_TAG;
  else if (imageType === "ma") imageTypeForSearch = MACRO_IMAGE_TAG;
  else imageTypeForSearch = null;

  let tissueTypeForSearch;
  if (tissueType === "Schilddrüse") tissueTypeForSearch = ORGAN_TAG_SCHILDDRÜSE;
  else if (tissueType === "Lunge") tissueTypeForSearch = ORGAN_TAG_LUNGE;
  else tissueTypeForSearch = null;

  // open up ribosome + go to lymedia search + set filter for imageType and tissueType + build list sorted by id:
  await createMarcsPathoList.data(imageTypeForSearch, tissueTypeForSearch);

  // open first asset of list + open image of asset in new page:
  await useMarcsPathoList.data();
}
pathoImage(process.argv[2], process.argv[3]); // will pass in the lymedia link
