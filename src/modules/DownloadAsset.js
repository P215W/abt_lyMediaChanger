async function DownloadAsset(page) {
  await page.click(".sf_admin_action_downloadoriginal a");
  await page.keyboard.press("Enter"); // it will download the file to the system's default download folder (which is "Downloads" in my case)
}

exports.data = DownloadAsset;
