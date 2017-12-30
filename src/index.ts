import * as Bluebird from "bluebird";
import * as glob from "glob";
import * as minimist from "minimist";
import * as path from "path";
import Parser from "./Parser";
import Part from "./Part";
import AmazonScraper from "./scrapers/amazon/AmazonScraper";

function gatherDetailsForPart(thePartNo: string): Bluebird<Part> {
    const parser = parsers.find((p) => p.recognize(thePartNo));
    if (parser) {
        const part = parser.parse(partNo);
        return loadAmazonDetails(part);
    } else {
        return Bluebird.resolve(null);
    }
}

function loadAmazonDetails(part: Part): Bluebird<Part> {
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

function loadParsers(): Parser[] {
    return glob.sync(path.join(__dirname, "parsers", "*.js"))
        .map((file) => {
            console.log(file);
            const ParserKlass = require(file).default;
            return new ParserKlass();
        });
}

const partNo = minimist(process.argv.slice(2))._[0];
const parsers = loadParsers();
const amazonScraper = new AmazonScraper();

gatherDetailsForPart(partNo)
    .then((part: Part) => {
        if (part) {
            console.log(JSON.stringify(part, null, 2));
        } else {
            console.log("unrecognized part");
        }
    });
