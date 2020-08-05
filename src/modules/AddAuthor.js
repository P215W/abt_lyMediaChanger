async function AddAuthor(puppeteerPage, author) {
  await puppeteerPage.type("#ly_media_asset_author", `${author}, `);
}

exports.data = AddAuthor;
