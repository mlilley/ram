"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../Parser");
const Part_1 = require("../Part");
class CorsairParser extends Parser_1.default {
    constructor() {
        super();
    }
    recognize(partNo) {
        return this.normalizePartNo(partNo).startsWith("CM");
    }
    parse(partNo) {
        partNo = this.normalizePartNo(partNo);
        if (!this.recognize(partNo)) {
            return null;
        }
        const part = new Part_1.default();
        const fields = partNo.match(/^CM([A-Z]*)(\d*)GX(.)M(\d)([A-Z]*)(\d*)C(\d*)$/);
        if (fields == null) {
            return null;
        }
        part.manufacturer = "Corsair";
        part.series = this.parseSeries(fields[1]);
        part.partNo = partNo;
        part.kind = this.parseKind(fields[3]);
        part.totalCapacity = this.parseTotalCapacity(fields[2]);
        part.sticks = this.parseSticks(fields[4]);
        part.stickCapacity = this.calculateStickCapacity(part.totalCapacity, part.sticks);
        part.cas = this.parseCas(fields[7]);
        part.speed = this.parseSpeed(fields[6]);
        if (part.kind == null ||
            part.series == null ||
            part.totalCapacity == null ||
            part.sticks == null ||
            part.cas == null ||
            part.speed == null) {
            return null;
        }
        // part.timings = ""; // lookup
        // part.price = 0; // lookup
        // part.url = ""; // lookup
        // TS allows this return to be ommitted?!
        return part;
    }
    parseKind(kind) {
        if (kind == null) {
            return null;
        }
        switch (kind) {
            case "1": return "DDR1";
            case "2": return "DDR2";
            case "3": return "DDR3";
            case "4": return "DDR4";
            default: return null;
        }
    }
    parseSeries(series) {
        if (series == null) {
            return null;
        }
        switch (series) {
            case "C": return "XMS Classic (old)";
            case "X": return "XMS Classic (new)";
            case "Z": return "Vengeance";
            case "L": return "Vengeance Low Profile";
            case "D": return "Dominator";
            case "K": return "Vengeance LPX";
            case "P": return "Dominator*";
            case "G": return "GT (Airflow II)";
            case "GS": return "GT (single module)";
            case "T": return "GT (Airflow II)*";
            case "R": return "Vengeance RGB";
            case "E": return "Non-Registered ECC";
            case "S": return "Registered ECC";
            case "SO": return "SoDIMM";
            case "SX": return "SoDIMM Vengeance";
            case "V": return "Value Select";
            case "Y": return "Vengeance Pro";
            default: return null;
        }
    }
    parseTotalCapacity(capacity) {
        if (capacity == null) {
            return null;
        }
        return parseInt(capacity, 10);
    }
    parseSticks(sticks) {
        if (sticks == null) {
            return null;
        }
        return parseInt(sticks, 10);
    }
    parseCas(cas) {
        if (cas == null) {
            return null;
        }
        return parseInt(cas, 10);
    }
    parseSpeed(speed) {
        if (speed == null) {
            return null;
        }
        return parseInt(speed, 10);
    }
    calculateStickCapacity(totalCapacity, sticks) {
        if (totalCapacity == null || sticks == null) {
            return null;
        }
        return Math.floor(totalCapacity / sticks);
    }
    normalizePartNo(partNo) {
        return partNo.trim().toUpperCase();
    }
}
exports.default = CorsairParser;
//# sourceMappingURL=CorsairParser.js.map