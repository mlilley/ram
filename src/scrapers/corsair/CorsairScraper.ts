import * as Bluebird from "bluebird";
import cheerio = require("cheerio");
import * as querystring from "querystring";
import * as url from "url";
import BaseScraper from "../BaseScraper";
import CorsairPartDetail from "./CorsairPartDetail";
import CorsairSearchResult from "./CorsairSearchResult";

export default class CorsairScraper extends BaseScraper {

    public scrapePartDetail(partNo: string): Bluebird<CorsairPartDetail> {
        partNo = this.normalizePartNo(partNo);
        return this.partSearch(partNo)
            .then((searchResults) => {
                const exactResult = this.findExactSearchResult(partNo, searchResults);
                if (exactResult) {
                    return this.partTechSpecs(exactResult.code);
                }
                return null;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    private partSearch(searchText: string): Bluebird<CorsairSearchResult[]> {
        return this.get("http://www.corsair.com/en-us/site-search", { params: { searchQuery: searchText } })
            .then((response) => this.extractSearchResults(response.data))
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    /**
     * Given the url of a part, loads the part details.
     *
     * The site's product details page contains no useful information (content
     * is loaded via a series of ajax requests after page load).
     *
     * The request to load the tech specs section is a forms post that gets
     * back some server-rendered html. The form data includes a string id'ing
     * the product to load, which corresponds to the last component of the
     * product detail page's url.
     *
     * So instead of loading the product detail page for the part, we instead
     * just simulate the ajax request for the tech-specs section and parse out
     * the data we want from the resulting html snippet.
     * @param partCode The product code (obtain from CorsairSearchResult.code).
     */
    private partTechSpecs(partCode: string): Bluebird<CorsairPartDetail> {
        const formData = querystring.stringify({
            divProductTabParam: "divTechSpecgrp",
            pName: partCode,
        });
        // NB: axios automatically parses the response as json (even though
        // the response headers specify content-type text/html).
        return this.post("http://www.corsair.com/sublayouts/www/Async%20Pages/ProductDetailPageTabs.aspx", formData)
            .then((response) => this.extractTechSpecs(response.data))
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    /**
     * Given a list of search-results, and the part number we were searching
     * for, find the search result matching the part searched for.
     * A search for a part number may return more than one search result, so
     * we have to look for the exact part by matching the partNo to a search
     * result's sku field.
     * @param partNo The partNo we're looking for.
     * @param searchParts The list of search results.
     */
    private findExactSearchResult(partNo: string, searchResults: CorsairSearchResult[]): CorsairSearchResult {
        return searchResults.find((result) => this.normalizePartNo(result.sku) === partNo) || null;
    }

    /**
     * Scrapes results out of a part search page.
     * @param html The search page to extract items from.
     */
    private extractSearchResults(html: string): CorsairSearchResult[] {
        const $ = cheerio.load(html);
        const items: CorsairSearchResult[] = [];
        // caution - the site inexplicably changes the classes attached to the
        // dom nodes here after the page loads (dev tools shows ul as ul.Grid
        // but the html actually comes down as ul.List).
        $("div.ProductGridView > div.ProductGridView ul.List li").each((i, domEl) => {
            const el = $(domEl);
            const item = new CorsairSearchResult();
            item.title = el.find("h2.ProductName a").first().text();
            item.url = el.find("h2.ProductName a").first().attr("href");
            item.sku = el.find("h2.ProductName a").first().attr("sku");
            item.code = this.partUrlToCode(item.url);
            items.push(item);
        });
        return items;
    }

    /**
     * Extracts part detail from a part detail page.
     * @param html The part detail page to extract details from.
     */
    private extractTechSpecs(data: any): CorsairPartDetail {
        // NB: axios automatically parses the response as json (even though
        // the response headers specify content-type text/html).
        const $ = cheerio.load(data.ProductTabsHtml);
        const specs = $(".AttributeValueBlock");
        const detail = new CorsairPartDetail();
        specs.each((i, specEl) => {
            const $$ = cheerio(specEl);
            const specLabel = $$.find(".LabelAttribute").text().trim();
            const specValue = $$.find(".ValueAttribute").text().trim();
            switch (specLabel) {
                case "SPD Latency":
                    detail.spdTiming = specValue;
                    break;
                case "SPD Speed":
                    detail.spdSpeed = specValue;
                    break;
                case "Tested Latency":
                    detail.ratedTiming = specValue;
                    break;
                case "Tested Speed":
                    detail.ratedSpeed = specValue;
                    break;
            }
        });
        return detail;
    }

    private partUrlToCode(partUrl: string): string {
        const pathname = url.parse(partUrl).pathname;
        const i = pathname.lastIndexOf("/");
        return pathname.substr(i);
    }

}
