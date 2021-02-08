async function GetUrl(page) {
  const pageUrl = await page.url();
  return pageUrl;
}

exports.data = GetUrl;
