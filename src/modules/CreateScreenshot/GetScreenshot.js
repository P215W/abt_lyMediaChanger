async function GetScreenshot(page, path) {
  await page.screenshot({ path: path });  // path must be string or string literal,
                                        // e.g.: `../assets/patInfoScreenshots/screenshotId${id}.png`

}

exports.data = GetScreenshot;
