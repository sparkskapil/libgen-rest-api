'use strict'

const Fs = require('fs')
const Path = require('path')

const axios = require('axios');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

function htmlToBooksArray(html) {
  const $ = cheerio.load(html);
  cheerioTableparser($);
  let data = $('body > table.c').parsetable(false, false, true);
  const columns = [];
  data = data.map((column, index, array) => {
    columns.push(column[0]);
    return column.splice(1);
  });

  const books = [];
  let currentColumn = columns[0];
  for (let i = 0; i < columns.length - 5; i++) {
    if (columns[i] != '')
      currentColumn = columns[i];
    for (let j = 0; j < data[i].length; j++) {
      if (!books[j]) {
        books[j] = {};
      }
      if (currentColumn == 'Mirrors') {
        let mirror = $(`body > table.c > tbody > tr:nth-child(${j + 2}) > td:nth-child(10) > a`).attr("href");
        books[j][currentColumn] = mirror;
        let server = mirror.substr(7);
        server = server.substr(0, server.indexOf('/'));
        books[j]['server'] = `http://${server}`;
      } else {
        books[j][currentColumn] = data[i][j];
      }
    }
  }
  return books;
}

async function getDownloadLink(book) {
  const response = await axios.get(book.Mirrors);
  const $ = cheerio.load(response.data);
  const downloadLink = $('#info > h2 > a').attr('href');
  const filename = $('#info > h1').text();

  return { Filename: `${filename}.${book.Extension}`, Downloadlink: `${downloadLink}` };
}

async function downloadEbook(book) {
  const response = await axios.get(book.Mirrors);
  const $ = cheerio.load(response.data);
  let server = book.Mirrors.substr(7);
  server = server.substr(0, server.indexOf('/'));
  const downloadLink = $('#info > h2 > a').attr('href');

  const path = Path.resolve(__dirname, 'books', `${book.ID}.${book.Extension}`);
  const writer = Fs.createWriteStream(path);

  const download = await axios({
    url: `${downloadLink}`,
    proxy: { host: server },
    method: 'GET',
    responseType: 'stream',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en - GB, en - US; q = 0.9, en; q = 0.8',
    }
  })

  download.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function getAdditionalInfo(books) {
  const fields = ['coverurl', 'md5'].join(',');
  const ids = books.map((book) => {
    return `${book.ID}`;
  }).join(',');
  if(ids.length == 0)
    return books;

  const url = `http://gen.lib.rus.ec/json.php?ids=${ids}&fields=${fields}`;
  const response = await axios.get(url).catch(e=>{});
  for (let i = 0; i < response.data.length; i++) {
    const cover = response.data[i].coverurl;
    books[i].cover = `${books[i].server}/covers/${cover}`;
    books[i].md5 = response.data[i].md5;
  }
  return books;
}

async function getEbooks(query) {
  const { req, page = 1, multi = false } = query;
  console.log(req);
  const url = `http://gen.lib.rus.ec/search.php?req=${encodeURIComponent(req)}`;
  let books = [];
  if (multi) {
    for (let i = 0; i < page; i++) {
      const response = await axios.get(`${url}&page=${i + 1}`);
      books = books.concat(htmlToBooksArray(response.data));
    }
  } else {
    const response = await axios.get(`${url}&page=${page}`).catch(e=>{});
    books = htmlToBooksArray(response.data);
  }
  return await getAdditionalInfo(books);
}

module.exports = { getDownloadLink, getEbooks, downloadEbook };