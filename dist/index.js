"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const glob = require("glob");
const minimist = require("minimist");
const path = require("path");
const AmazonScraper_1 = require("./scrapers/amazon/AmazonScraper");
function gatherDetailsForPart(thePartNo) {
    const parser = parsers.find((p) => p.recognize(thePartNo));
    if (parser) {
        const part = parser.parse(partNo);
        return loadAmazonDetails(part);
    }
    else {
        return Bluebird.resolve(null);
    }
}
function loadAmazonDetails(part) {
    return amazonScraper.productSearch(part.partNo)
        .then((results) => {
        if (results && results.length > 0 && results[0] !== null) {
            part.price = results[0].price;
            part.url = results[0].url;
        }
        return part;
    })
        .finally(() => {
        return part;
    });
}
function loadParsers() {
    return glob.sync(path.join(__dirname, "parsers", "*.js"))
        .map((file) => {
        console.log(file);
        const ParserKlass = require(file).default;
        return new ParserKlass();
    });
}
const partNo = minimist(process.argv.slice(2))._[0];
const parsers = loadParsers();
const amazonScraper = new AmazonScraper_1.default();
gatherDetailsForPart(partNo)
    .then((part) => {
    if (part) {
        console.log(JSON.stringify(part, null, 2));
    }
    else {
        console.log("unrecognized part");
    }
});
//# sourceMappingURL=index.js.map