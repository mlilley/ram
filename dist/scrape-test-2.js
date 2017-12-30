"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = cheerio.load(fs.readFileSync("../test.html").toString());
//# sourceMappingURL=scrape-test-2.js.map