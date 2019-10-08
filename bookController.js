const utils = require('./utils');

async function getEbookList(req, res) {
  const ebooks = await utils.getEbooks(req.query);
  res.status(200);
  return res.json(ebooks);
}

async function getDownloadLink(req, res) {
  console.log(req.query);
  const book = await utils.getDownloadLink(req.query);
  res.status(200);
  return res.json({ book });
}

module.exports = { getEbookList, getDownloadLink };

