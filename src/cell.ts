export default class Cell {
    constructor(
        public lw: boolean = false, // Line West
        public ln: boolean = false, // Line North
        public cw: boolean = false, // Cut West
        public cn: boolean = false, // Cut North
        public fallen: boolean = false, // Fallen
    ) {}
}