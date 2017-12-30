import * as CorsairParser from "./parsers/corsair";
import * as GSkillParser from "./parsers/gskill";

// const partNo = "CMR16GX4M2C3000C15";
const partNo = "F3-17000CL9Q-16GBZH";
const parsers = [CorsairParser, GSkillParser];
const parser = parsers.find((p) => p.recognize(partNo));
if (parser) {
    console.log(parser.parse(partNo));
} else {
    console.log("unrecognized");
}
