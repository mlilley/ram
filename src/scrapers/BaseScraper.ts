import axios from "axios";
import * as Bluebird from "bluebird";

export default class BaseScraper {

    protected get(url: string, options: any): Bluebird<any> {
        // jump through hoops to convert from axios promises to bluebird's
        return Bluebird.resolve(axios.get(url, options))
            .then(Bluebird.resolve)
            .catch(Bluebird.reject);
    }

    protected post(url: string, options: any): Bluebird<any> {
        // jump through hoops to convert from axios promises to bluebird's
        return Bluebird.resolve(axios.post(url, options))
            .then(Bluebird.resolve)
            .catch(Bluebird.reject);
    }

    protected normalizePartNo(partNo: string): string {
        return partNo.trim().toUpperCase();
    }

}
