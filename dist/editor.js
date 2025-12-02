import Game from './game.js';
import Point from './point.js';
import Cell from './cell.js';
import Vec2 from './vec2.js';
export default class Editor {
    srcGame;
    dstGame;
    srcPoint;
    dstPoint;
    building;
    connecting;
    constructor(srcGame, dstGame) {
        this.srcGame = srcGame;
        this.dstGame = dstGame;
        this.srcPoint = new Point(0, 0);
        this.dstPoint = new Point(0, 0);
        this.building = false;
        this.connecting = false;
    }
    isEditMode() {
        return this.srcGame.canvas.style.display === 'block';
    }
    srcMouseDown(event) {
        if (this.isEditMode()) {
            const point = this.pointAt(this.srcGame, event.offsetX, event.offsetY);
            if (this.srcGame.inBounds(point.x, point.y)) {
                this.srcPoint = point;
                this.refresh();
            }
        }
    }
    startBuilding(point) {
        if (!this.dstGame.inBounds(point.x, point.y))
            return;
        this.building = true;
        const srcCell = this.srcGame.grid[this.srcPoint.x][this.srcPoint.y];
        this.disconnectAt(point);
        this.dstGame.grid[point.x][point.y] = new Cell(srcCell.lw, srcCell.ln, srcCell.cw, srcCell.cn);
        this.dstGame.render();
    }
    startConnecting() {
        this.connecting = true;
    }
    dstMouseDown(event) {
        if (!this.isEditMode())
            return;
        const point = this.pointAt(this.dstGame, event.offsetX, event.offsetY);
        if (!this.dstGame.inBounds(point.x, point.y))
            return;
        const srcPlayer = this.srcGame.player;
        if (this.srcPoint.x === srcPlayer.x && this.srcPoint.y === srcPlayer.y) {
            this.dstGame.player.x = point.x;
            this.dstGame.player.y = point.y;
            this.dstGame.render();
            return;
        }
        this.dstPoint = point;
        if (event.button === 0) {
            this.startBuilding(point);
        }
        else if (event.button === 2) {
            this.startConnecting();
        }
    }
    keepBuilding(point) {
        if (!this.dstGame.inBounds(point.x, point.y))
            return;
        if (this.dstGame.player.x === point.x && this.dstGame.player.y === point.y)
            return;
        const srcCell = this.srcGame.grid[this.srcPoint.x][this.srcPoint.y];
        if (this.dstPoint.x === point.x && this.dstPoint.y === point.y)
            return;
        this.disconnectAt(point);
        this.dstGame.grid[point.x][point.y] = new Cell(srcCell.lw, srcCell.ln, srcCell.cw, srcCell.cn);
        this.dstGame.render();
    }
    keepConnecting(point) {
        const dx = point.x - this.dstPoint.x;
        const dy = point.y - this.dstPoint.y;
        if (Math.abs(dx) + Math.abs(dy) !== 1)
            return;
        const prevCell = this.dstGame.grid[this.dstPoint.x][this.dstPoint.y];
        const currCell = this.dstGame.grid[point.x][point.y];
        if (prevCell.lw !== currCell.lw || prevCell.ln !== currCell.ln)
            return;
        if (dx === 1) {
            prevCell.cw = true;
            currCell.cw = true;
        }
        else if (dy === 1) {
            prevCell.cn = true;
            currCell.cn = true;
        }
        if (dx === -1) {
            prevCell.cw = true;
            currCell.cw = true;
        }
        else if (dy === -1) {
            prevCell.cn = true;
            currCell.cn = true;
        }
        this.dstGame.render();
    }
    dstMouseMove(event) {
        if (!this.isEditMode())
            return;
        const point = this.pointAt(this.dstGame, event.offsetX, event.offsetY);
        if (!this.dstGame.inBounds(point.x, point.y))
            return;
        if (this.dstPoint.x === point.x && this.dstPoint.y === point.y)
            return;
        if (this.building) {
            this.keepBuilding(point);
        }
        if (this.connecting) {
            this.keepConnecting(point);
        }
        this.dstPoint = point;
    }
    dstMouseUp(event) {
        if (event.button === 0) {
            this.building = false;
        }
        else if (event.button === 2) {
            this.connecting = false;
        }
    }
    toggleEditMode() {
        this.srcGame.canvas.style.display = this.srcGame.canvas.style.display !== 'block' ? 'block' : 'none';
        this.refresh();
        this.dstGame.refresh();
    }
    pointAt(game, displayX, displayY) {
        const cellSize = game.cellSize;
        const displayRect = game.displayRect;
        const x = Math.floor((displayX - displayRect.x) / cellSize);
        const y = Math.floor((displayY - displayRect.y) / cellSize);
        return new Point(x, y);
    }
    disconnectAt(point) {
        const x = point.x;
        const y = point.y;
    }
    grow(direction) {
        this.dstGame.refresh();
    }
    shrink(direction) {
        this.dstGame.refresh();
    }
    refresh() {
        this.srcGame.refresh();
        this.render();
    }
    render() {
        this.renderSelection();
    }
    renderSelection() {
        const cellSize = this.srcGame.cellSize;
        const displayRect = this.srcGame.displayRect;
        const x = displayRect.x + this.srcPoint.x * cellSize;
        const y = displayRect.y + this.srcPoint.y * cellSize;
        this.srcGame.ctx.lineWidth = 4;
        this.srcGame.ctx.strokeStyle = '#92baf6';
        this.srcGame.ctx.strokeRect(x, y, cellSize, cellSize);
    }
}
//# sourceMappingURL=editor.js.map