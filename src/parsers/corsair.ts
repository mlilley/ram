import RamPart from "../part";
import * as util from "../util";

export function recognize(partNo: string): boolean {
    return util.normalizePartNo(partNo).startsWith("CM");
}

export function parse(partNo: string): RamPart {
    partNo = util.normalizePartNo(partNo);
    if (!this.recognize(partNo)) {
        return null;
    }

    const fields = partNo.match(/^CM([A-Z]*)(\d*)GX(.)M(\d)([A-Z]*)(\d*)C(\d*)([A-Z]*)$/);
    if (fields === null) {
        return null;
    }

    const part = new RamPart();
    part.manufacturer = "Corsair";
    part.series = parseSeries(fields[1]);
    part.partNo = partNo;
    part.revision = parseRevision(fields[5]);
    part.technology = parseTechnology(fields[3]);
    part.totalCapacity = parseNumeric(fields[2]);
    part.sticks = parseNumeric(fields[4]);
    part.stickCapacity = calculateStickCapacity(part.totalCapacity, part.sticks);
    part.speed = parseNumeric(fields[6]);
    part.cas = parseNumeric(fields[7]);
    part.color = parseColor(fields[8]);

    return part;
}

function parseSeries(series: string): string {
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

function parseRevision(revision: string): string {
    return revision;
}

function parseTechnology(technology: string): string {
    switch (technology) {
        case "1": return "DDR1";
        case "2": return "DDR2";
        case "3": return "DDR3";
        case "4": return "DDR4";
        default: return null;
    }
}

function parseNumeric(field: string): number {
    const parsed = parseInt(field, 10);
    return isNaN(parsed) ? null : parsed;
}

function calculateStickCapacity(totalCapacity: number, sticks: number): number {
    if (totalCapacity === null || sticks === null || sticks === 0) {
        return null;
    }
    return Math.floor(totalCapacity / sticks);
}

function parseColor(color: string): string {
    switch (color) {
        case "R": return "Red";
        case "W": return "White";
        case "B": return "Blue";
        default: return null;
    }
}
