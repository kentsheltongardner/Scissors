import Size from './size.js';
import Cell from './cell.js';
import Point from './point.js';
import Rect from './rect.js';
export default class Game {
    grid: Cell[][];
    size: Size;
    currentLevel: number;
    levels: string[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cellSize: number;
    player: Point;
    displayRect: Rect;
    constructor(levels: string[], canvas: HTMLCanvasElement);
    loadLevelData(json: string): void;
    levelData(): string;
    attemptMove(moveDir: number): void;
    cut(): void;
    fall(x: number, y: number): boolean;
    restore(x: number, y: number): void;
    levelComplete(): boolean;
    firstLevel(): void;
    previousLevel(): void;
    resetLevel(): void;
    nextLevel(): void;
    lastLevel(): void;
    goToLevel(level: number): void;
    inBounds(x: number, y: number): boolean;
    canFall(x: number, y: number): boolean;
    refresh(): void;
    render(): void;
    renderPaper(): void;
    renderLines(): void;
    renderCuts(): void;
    renderPlayer(): void;
    updateDisplayInfo(): void;
}
//# sourceMappingURL=game.d.ts.map