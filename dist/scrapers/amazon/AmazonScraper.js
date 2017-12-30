"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const BaseScraper_1 = require("../BaseScraper");
const AmazonSearchResult_1 = require("./AmazonSearchResult");
class AmazonScraper extends BaseScraper_1.default {
    /**
     * Perform a product search on amazon for the specified text.
     * @param searchText
     */
    productSearch(searchText) {
        return this.get("https://www.amazon.com/s", { params: { "field-keywords": searchText } })
            .then((response) => this.extractSearchResults(response.data))
            .catch((err) => {
            console.log(err);
            return null;
        });
    }
    extractSearchResults(html) {
        const $ = cheerio.load(html);
        const items = [];
        $("ul#s-results-list-atf").find("li.s-result-item").each((i, domEl) => {
            const el = $(domEl);
            const item = new AmazonSearchResult_1.default();
            item.asin = el.attr("data-asin");
            item.title = el.find("h2.s-access-title").first().attr("data-attribute");
            item.url = el.find("a.s-access-detail-page").first().attr("href");
            const wholeEl = el.find("span.sx-price").first().find("span.sx-price-whole");
            const fracEl = el.find("span.sx-price").first().find("sup.sx-price-fractional");
            if (wholeEl.length === 1 && fracEl.length === 1) {
                item.price = parseInt(wholeEl.text(), 10) + parseInt(fracEl.text(), 10) / 100;
            }
            else {
                item.price = null;
            }
            const ratingEl = el.find("i.a-icon-star").first().find("span.a-icon-alt");
            if (ratingEl.length === 1) {
                const rating = ratingEl.text().match(/^[0-9]+\.?[0-9]*/);
                if (rating) {
                    item.rating = parseFloat(rating[0]);
                }
                else {
                    item.rating = null;
                }
            }
            else {
                item.rating = null;
            }
            items.push(item);
        });
        return items;
    }
}
exports.default = AmazonScraper;
//# sourceMappingURL=AmazonScraper.js.map