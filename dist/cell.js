export default class Cell {
    lw;
    ln;
    cw;
    cn;
    fallen;
    constructor(lw = false, // Line West
    ln = false, // Line North
    cw = false, // Cut West
    cn = false, // Cut North
    fallen = false) {
        this.lw = lw;
        this.ln = ln;
        this.cw = cw;
        this.cn = cn;
        this.fallen = fallen;
    }
}
//# sourceMappingURL=cell.js.map