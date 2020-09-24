const puppeteer = require("puppeteer");
const _ = require("lodash");

async function MakeLyMediaList(
  URL_FOR_USE,
  IS_US_ENVIRONMENT,
  USERNAME,
  USER_IDENTIFICATION,
  LYMEDIA_SEARCH_TITLE,
  LYMEDIA_SEARCH_DESCRIPTION,
  LYMEDIA_SEARCH_AUTHOR,
  LYMEDIA_SEARCH_STATUS,
  LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE,
  LYMEDIA_SEARCH_CHOOSECOPYRIGHTS,
  LYMEDIA_SEARCH_REQUIRE_TAGS,
  LYMEDIA_SEARCH_EXCLUDE_TAGS
) {
  //   const str = "";
  //   const pos = str.search("von");
  //   const realPos = pos + 4;
  //   console.log(str.substring(realPos, str.length - 1));
  let arrWithLinks = [];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  await page.goto(URL_FOR_USE);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred

  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);
  await Promise.all([
    page.click('[href="/ly_media_asset"]'),
    page.waitForNavigation(),
  ]);

  // SEARCH IN LYMEDIA:
  // SEARCH PARAMS:
  if (LYMEDIA_SEARCH_TITLE) await page.type("#ly_media_asset_filters_title", `${LYMEDIA_SEARCH_TITLE}`);
  if (LYMEDIA_SEARCH_DESCRIPTION) await page.type("#ly_media_asset_filters_description", `${LYMEDIA_SEARCH_DESCRIPTION}`);
  if (LYMEDIA_SEARCH_AUTHOR) await page.type("#ly_media_asset_filters_author", `${LYMEDIA_SEARCH_AUTHOR}`); // for text-input "author"
  if (LYMEDIA_SEARCH_STATUS) await page.select("#ly_media_asset_filters_status", `${LYMEDIA_SEARCH_STATUS}`);
  if (LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE)
    await page.select(
      "#ly_media_asset_filters_external_addition_type",
      `${LYMEDIA_SEARCH_EXTERNAL_ADDITION_TYPE}`
    );
  
  if (LYMEDIA_SEARCH_CHOOSECOPYRIGHTS) await page.select("#ly_media_asset_filters_copyright", `${LYMEDIA_SEARCH_CHOOSECOPYRIGHTS}`);
  if (LYMEDIA_SEARCH_REQUIRE_TAGS) await page.select("#ly_media_asset_filters_include_tags", `${LYMEDIA_SEARCH_REQUIRE_TAGS}`);
  if (LYMEDIA_SEARCH_EXCLUDE_TAGS) await page.select("#ly_media_asset_filters_exclude_tags", `${LYMEDIA_SEARCH_EXCLUDE_TAGS}`);

  // CLICK FILTER BUTTON:
  await Promise.all([
    page.click(
      'form[action="/ly_media_asset/filter/action"] input[type="submit"]'
    ), // alternat.: for DE: page.click('[value="Filtern"]'), for US: page.click('[value="Filter"]'),
    page.waitForNavigation(),
  ]);

  // SORT RESULTS BY ID (DESCENDING, aka. NEW TO OLD IDs):
  await Promise.all([
    page.click(".sf_admin_list_th_id a"),
    page.waitForNavigation(),
  ]);
  await Promise.all([
    page.click(".sf_admin_list_th_id a"),
    page.waitForNavigation(),
  ]);

  // GET PAGE AMOUNT OF SEARCH RESULTS:
  let pageAmount;
  if (IS_US_ENVIRONMENT) {
    // GET PAGE AMOUNT FOR ---US--- TO NAVIGATE THROUGH ALL SEARCH RESULT PAGES:
    const inner_html = await page.evaluate(() =>
      document.querySelector('[colspan="7"]').innerHTML.trim()
    );
    console.log("inner_html: ", inner_html);
    const position = inner_html.search("1/"); // for targeting e.g. "page(1/3)"
    if (position !== -1) {
      const realPosition = position + 2;
      pageAmount = inner_html.substring(realPosition, inner_html.length - 1);
    } else {
      pageAmount = 1;
    }
    console.log("maxPageAmountUS: ", pageAmount);
  } else {
    // GET PAGE AMOUNT FOR ---DE--- TO NAVIGATE THROUGH ALL SEARCH RESULT PAGES:
    const inner_html = await page.evaluate(() =>
      document.querySelector('[colspan="7"]').innerHTML.trim()
    );
    console.log("HERE: ", inner_html);
    const position = inner_html.search("von");
    if (position !== -1) {
      const realPosition = position + 4;
      pageAmount = inner_html.substring(realPosition, inner_html.length - 1);
    } else {
      pageAmount = 1;
    }
    console.log("maxPageAmountDE: ", pageAmount);
  }

  // BUILD ONE BIG ARRAY THAT HOLDS ALL PAGE-ARRAYS. A PAGE-ARRAY HOLDS ALL LYMEDIA-IDS FOUND FOR THE GIVEN SEARCH:
  for (let i = 1; i <= pageAmount; i++) {
    await page.goto(
      `${URL_FOR_USE}ly_media_asset?page=${i}`
    );
    arrForPush = await page.$$eval(".sf_admin_list_td_id a", (links) =>
      links.map((link) => link.innerHTML)
    );
    arrWithLinks.push(arrForPush);
  }
  const bigArray = _.flatten(arrWithLinks);
  console.log("bigArray.length: ", bigArray.length);
  console.log("bigArray: ", bigArray);

  return bigArray;
}

exports.data = MakeLyMediaList;
