// import Parser from "../Parser"
// import Part from "../Part"
// export default class GSkillParser extends Parser {
//     public constructor() {
//         super()
//     }
//     public recognize(partNo: string): boolean {
//         partNo = partNo.trim().toUpperCase();
//         return partNo.startsWith("F");
//     }
//     public parse(partNo: string): Part {
//         partNo = partNo.trim().toUpperCase();
//         if (!this.recognize(partNo)) return null;
//         let part = new Part();
//         let fields = partNo.match(/^CM([A-Z]*)(\d*)GX(.)M(\d)([A-Z]*)(\d*)C(\d*)$/)
//         if (fields == null) return null;
//         part.manufacturer = "Corsair"
//         part.partNo = partNo
//         part.kind = this.parseKind(fields[3])
//         part.series = this.parseSeries(fields[1], part.kind)
//         part.totalCapacity = this.parseTotalCapacity(fields[2])
//         part.sticks = this.parseSticks(fields[4])
//         part.cas = this.parseCas(fields[7])
//         part.speed = this.parseSpeed(fields[6])
//         part.stickCapacity = this.calculateStickCapacity(part.totalCapacity, part.sticks)
//         if (part.kind == null || part.series == null || part.totalCapacity == null || part.sticks == null || part.cas == null || part.speed == null) return null
//         // part.timings = "" // lookup
//         // part.price = 0 // lookup
//         // part.url = "" // lookup
//         // TS allows this return to be ommitted?!
//         return part
//     }
//     private parseKind(kind: string): string {
//         if (kind == null) return null
//         switch (kind) {
//             case "1": return "DDR1"
//             case "2": return "DDR2"
//             case "3": return "DDR3"
//             case "4": return "DDR4"
//             default: return null
//         }
//     }
//     private parseSeries(series: string, kind: string): string {
//         if (series == null) return null;
//         switch (series) {
//             case "C":  return "XMS Classic (old)"
//             case "X":  return "XMS Classic (new)"
//             case "Z":  return "Vengeance"
//             case "L":  return "Vengeance Low Profile"
//             case "D":  return "Dominator"
//             case "K":  return "Vengeance LPX"
//             case "P":  return "Dominator*"
//             case "G":  return "GT (Airflow II)"
//             case "GS": return "GT (single module)"
//             case "T":  return "GT (Airflow II)*"
//             case "R":
//                 if (kind == "DDR4") return "Vengeance RGB"
//                 return "Retail"
//             case "E":  return "Non-Registered ECC"
//             case "S":  return "Registered ECC"
//             case "SO": return "SoDIMM"
//             case "SX": return "SoDIMM Vengeance"
//             case "V":  return "Value Select"
//             case "Y":  return "Vengeance Pro"
//             default: return null
//         }
//     }
//     private parseTotalCapacity(capacity: string): number {
//         if (capacity == null) return null
//         return parseInt(capacity)
//     }
//     private parseSticks(sticks: string): number {
//         if (sticks == null) return null
//         return parseInt(sticks)
//     }
//     private parseCas(cas: string): number {
//         if (cas == null) return null
//         return parseInt(cas)
//     }
//     private parseSpeed(speed: string): number {
//         if (speed == null) return null
//         return parseInt(speed)
//     }
//     private calculateStickCapacity(totalCapacity: number, sticks: number): number {
//         if (totalCapacity == null || sticks == null) return null;
//         return Math.floor(totalCapacity / sticks)
//     }
// }
//# sourceMappingURL=GSkillParser.js.map