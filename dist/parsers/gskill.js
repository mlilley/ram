"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const part_1 = require("../part");
const util = require("../util");
function recognize(partNo) {
    return util.normalizePartNo(partNo).startsWith("F");
}
exports.recognize = recognize;
function parse(partNo) {
    partNo = util.normalizePartNo(partNo);
    if (!this.recognize(partNo)) {
        return null;
    }
    // "F3-17000CL9Q-16GBZH"
    const fields = partNo.match(/^F([A-Z\d]+)\-(\d+)CL?(\d+)([A-Z]\d?)\-(\d+)GB?([A-Z\d]+)$/);
    console.log("-- a --");
    if (fields === null) {
        console.log("-- b --");
        return null;
    }
    console.log("-- c --");
    const part = new part_1.default();
    part.manufacturer = "G.Skill";
    part.series = parseSeries(fields[6]);
    part.partNo = partNo;
    part.revision = null;
    part.technology = parseTechnology(fields[1]);
    part.totalCapacity = parseNumeric(fields[5]);
    part.sticks = parseSticks(fields[4]);
    part.stickCapacity = calculateStickCapacity(part.totalCapacity, part.sticks);
    part.speed = parseNumeric(fields[2]);
    part.cas = parseNumeric(fields[3]);
    part.color = parseColor(fields[6]);
    part.other = parseOther(fields[6]);
    return part;
}
exports.parse = parse;
function parseSeries(series) {
    if (series.endsWith("D")) {
        series = series.slice(0, -1);
    }
    switch (series) {
        case "RH":
        case "RM":
        case "RL": return "Ripjaws";
        case "VR":
        case "VB":
        case "VK":
        case "VS":
        case "VG": return "Ripjaws V";
        case "XH":
        case "XM":
        case "XL": return "Ripjaws X";
        case "ZH":
        case "ZM":
        case "ZL": return "Ripjaws Z";
        case "RR":
        case "RB":
        case "RK": return "Ripjaws 4";
        case "TZ":
        case "TZSW":
        case "TZSK":
        case "TZKW":
        case "TZKO":
        case "TZKY": return "Trident Z";
        case "TX": return "Trident X";
        case "TD": return "Trident";
        case "AR":
        case "AB":
        case "AO": return "Ares";
        case "ECO": return "ECO";
        case "SR":
        case "SR1":
        case "SR2": return "Snipers";
        case "IS":
        case "ISL": return "Aegis";
        case "NQ":
        case "PK":
        case "HK": return "Performance";
        case "NT":
        case "NS": return "Value";
        case "SQ":
        case "SK": return "SO-DIMM";
        default: return null;
    }
}
function parseRevision(revision) {
    return revision;
}
function parseTechnology(technology) {
    switch (technology) {
        case "1": return "DDR1";
        case "2": return "DDR2";
        case "3": return "DDR3";
        case "4": return "DDR4";
        case "A": return "Apple";
        default: return null;
    }
}
function parseSticks(sticks) {
    if (sticks === null || sticks === "") {
        return 1;
    }
    switch (sticks) {
        case "S": return 1;
        case "D": return 2;
        case "Q": return 4;
        case "Q2": return 8;
        case "T": return 3;
        case "T2": return 6;
        default: return null;
    }
}
function parseColor(series) {
    switch (series) {
        case "VR": return "Red";
        case "VB": return "Blue";
        case "VK": return "Black";
        case "RR": return "Red";
        case "RB": return "Blue";
        case "RK": return "Black";
        case "TZSW": return "Silver/White";
        case "TZSK": return "Silver/Black";
        case "TZKW": return "Black/White";
        case "TZKO": return "Black/Orange";
        case "TZKY": return "Black/Yellow";
        default: return null;
    }
}
function parseOther(series) {
    const other = [];
    if (series.endsWith("D")) {
        series = series.slice(0, -1);
        other.push("Fans");
    }
    return other;
}
function calculateStickCapacity(totalCapacity, sticks) {
    if (totalCapacity === null || sticks === null || sticks === 0) {
        return null;
    }
    return Math.floor(totalCapacity / sticks);
}
function parseNumeric(field) {
    const parsed = parseInt(field, 10);
    return isNaN(parsed) ? null : parsed;
}
//# sourceMappingURL=gskill.js.map