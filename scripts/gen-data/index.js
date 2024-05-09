// create a list of urls of website
// and save it to a csv file
const fs = require("fs");
const path = require("path"); 

const csv = require('fast-csv');

const csvStream = csv.format({ headers: false });

const writableStream = fs.createWriteStream(path.join(__dirname, "urls.csv"));

const urls = [];

for (let i = 0; i < 2; i++) {
  urls.push("https://shikhar.pro/");
}

csvStream.pipe(writableStream);
urls.forEach(url => {
  csvStream.write({ url });
});
csvStream.end();


