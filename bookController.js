const utils = require('./utils');

async function getEbookList(req, res) {
  if (!req.query || !req.query.req) {
    res.status(200);
    return res.json({ err: 'Query string required!' });
  }
  const ebooks = await utils.getEbooks(req.query);
  res.status(200);
  return res.json(ebooks);
}

async function getDownloadLink(req, res) {
  if (!req.query || !req.query.req) {
    res.status(200);
    return res.json({ err: 'Query string required!' });
  }
  const book = await utils.getDownloadLink(req.query);
  res.status(200);
  return res.json({ book });
}

module.exports = { getEbookList, getDownloadLink };

