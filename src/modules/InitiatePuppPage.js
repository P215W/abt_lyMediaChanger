const puppeteer = require("puppeteer");

async function InitiatePuppPage(url, USERNAME, USER_IDENTIFICATION) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(190000);

  await page.goto(`${url}`);
  await page.type("#signin_username", `${USERNAME}`); // cred
  await page.type("#signin_password", `${USER_IDENTIFICATION}`); // cred
  await Promise.all([page.click("tfoot input"), page.waitForNavigation()]);

  return { browser, page };
}

exports.data = InitiatePuppPage;
