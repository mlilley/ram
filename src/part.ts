export default class RamPart {
    public manufacturer: string;
    public series: string;
    public partNo: string;
    public revision: string;
    public technology: string;
    public totalCapacity: number;
    public stickCapacity: number;
    public sticks: number;
    public speed: number;
    public cas: number;
    public color: string;
    public other: string[]; // stash misc properties here

    public constructor() {
        this.other = [];
    }
}
