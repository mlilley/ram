import RamPart from "../part";
import * as util from "../util";

export function recognize(partNo: string): boolean {
    return util.normalizePartNo(partNo).startsWith("F");
}

export function parse(partNo: string): RamPart {
    partNo = util.normalizePartNo(partNo);
    if (!this.recognize(partNo)) {
        return null;
    }

    const fields = partNo.match(/^F([A-Z\d]+)\-(\d+)CL?(\d+)([A-Z]\d?)\-(\d+)GB?([A-Z\d]+)$/);
    if (fields === null) {
        return null;
    }

    const part = new RamPart();
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

function parseSeries(series: string): string {
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

function parseRevision(revision: string): string {
    return revision;
}

function parseTechnology(technology: string): string {
    switch (technology) {
        case "1": return "DDR1";
        case "2": return "DDR2";
        case "3": return "DDR3";
        case "4": return "DDR4";
        case "A": return "Apple";
        default: return null;
    }
}

function parseSticks(sticks: string): number {
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

function parseColor(series: string): string {
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

function parseOther(series: string): string[] {
    const other = [];
    if (series.endsWith("D")) {
        series = series.slice(0, -1);
        other.push("Fans");
    }
    return other;
}

function calculateStickCapacity(totalCapacity: number, sticks: number): number {
    if (totalCapacity === null || sticks === null || sticks === 0) {
        return null;
    }
    return Math.floor(totalCapacity / sticks);
}

function parseNumeric(field: string): number {
    const parsed = parseInt(field, 10);
    return isNaN(parsed) ? null : parsed;
}
