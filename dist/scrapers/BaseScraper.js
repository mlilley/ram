"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Bluebird = require("bluebird");
class BaseScraper {
    get(url, options) {
        // jump through hoops to convert from axios promises to bluebird's
        return Bluebird.resolve(axios_1.default.get(url, options))
            .then(Bluebird.resolve)
            .catch(Bluebird.reject);
    }
    post(url, options) {
        // jump through hoops to convert from axios promises to bluebird's
        return Bluebird.resolve(axios_1.default.post(url, options))
            .then(Bluebird.resolve)
            .catch(Bluebird.reject);
    }
    normalizePartNo(partNo) {
        return partNo.trim().toUpperCase();
    }
}
exports.default = BaseScraper;
//# sourceMappingURL=BaseScraper.js.map