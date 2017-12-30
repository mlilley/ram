"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CorsairScraper_1 = require("./scrapers/corsair/CorsairScraper");
const scraper = new CorsairScraper_1.default();
// scraper.partSearch("CMK32GX4M2A2400C14") = (url, options): any => {
//     const fs = require("fs");
//     const content = { data: fs.readFileSync("../test.html") };
//     return Promise.resolve(content);
// };
// scraper.productSearch("CMK32GX4M2A2400C14").then((result) => {
//     console.log("done:", result);
// });
scraper.scrapePartDetail("CMR16GX4M2C3000C15")
    .then((part) => {
    console.log("part details:", part);
})
    .catch((err) => {
    console.log("error:", err);
});
//# sourceMappingURL=scrape-test.js.map