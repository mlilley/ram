"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CorsairParser = require("./parsers/corsair");
const GSkillParser = require("./parsers/gskill");
const partNo = "F3-17000CL9Q-16GBZH";
// const partNo = "CMR16GX4M2C3000C15";
const parsers = [CorsairParser, GSkillParser];
const parser = parsers.find((p) => p.recognize(partNo));
if (parser) {
    console.log(parser.parse(partNo));
}
else {
    console.log("unrecognized");
}
//# sourceMappingURL=parse-test.js.map