import Size     from './size.js'
import Cell     from './cell.js'
import Point    from './point.js'
import Rect     from './rect.js'
import Dir      from './dir.js'

const TAU = 2 * Math.PI

export default class Game {
    grid: Cell[][]
    size: Size
    currentLevel: number
    levels: string[]
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    cellSize: number
    player: Point
    displayRect: Rect

    constructor(levels: string[], canvas: HTMLCanvasElement) {
        this.canvas         = canvas
        this.ctx            = canvas.getContext('2d')!
        this.cellSize       = 0
        this.displayRect    = new Rect(0, 0, 0, 0)

        this.size           = new Size(0, 0)

        this.currentLevel   = 0
        this.levels         = levels

        this.player         = new Point(0, 0)
        this.grid           = []

        this.resetLevel()
        this.updateDisplayInfo()
    }

    loadLevelData(json: string) {
        const levelData = JSON.parse(json)
        this.player     = new Point(levelData.player.x, levelData.player.y)
        const w         = levelData.grid.length
        const h         = levelData.grid[0]!.length
        this.size       = new Size(w, h)
        this.grid       = new Array(w).fill(0).map(() => new Array(h).fill(0).map(() => new Cell()))
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const cellData      = levelData.grid[i][j]
                this.grid[i][j]     = new Cell(cellData.lw, cellData.ln, cellData.cw, cellData.cn)
            }
        }
    }
    levelData() {
        const levelData = {
            player:     this.player,
            grid:       this.grid,
        }
        return JSON.stringify(levelData)
    }

    attemptMove(moveDir: number) {
        const x = this.player.x
        const y = this.player.y
        let moved = false
        switch (moveDir) {
            case Dir.North: {
                const cell = this.grid[x][y - 1]
                if (cell.lw && !cell.cw) {
                    this.player.y--
                    cell.cw = true
                    moved = true
                }
                break
            }
            case Dir.South: {
                const cell = this.grid[x][y]
                if (cell.lw && !cell.cw) {
                    this.player.y++
                    cell.cw = true
                    moved = true
                }
                break
            }
            case Dir.West: {
                const cell = this.grid[x - 1][y]
                if (cell.ln && !cell.cn) {
                    this.player.x--
                    cell.cn = true
                    moved = true
                }
                break
            }
            case Dir.East: {
                const cell = this.grid[x][y]
                if (cell.ln && !cell.cn) {
                    this.player.x++
                    cell.cn = true
                    moved = true
                }
                break
            }
        }
        if (moved) {
            this.cut()
        }
    }

    cut() {
        const x = this.player.x
        const y = this.player.y
        for (let i = x - 1; i <= x; i++) {
            for (let j = y - 1; j <= y; j++) {
                if (!this.fall(i, j)) {
                    this.restore(i, j)
                }
            }
        }
    }

    fall(x: number, y: number): boolean {
        if (!this.canFall(x, y)) return false

        const cell = this.grid[x][y]
        if (cell.fallen) return true

        cell.fallen = true

        const cellE = this.grid[x + 1][y]
        const cellS = this.grid[x][y + 1]

        let preserve = false

        preserve ||= !cellE.cw && !this.fall(x + 1, y)
        preserve ||= !cellS.cn && !this.fall(x, y + 1)
        preserve ||= !cell.cw && !this.fall(x - 1, y)
        preserve ||= !cell.cn && !this.fall(x, y - 1)

        return !preserve
    }

    restore(x: number, y: number) {
        const cell = this.grid[x][y]
        if (!cell.fallen) return

        this.grid[x][y].fallen = false

        const cellE = this.grid[x + 1][y]
        const cellS = this.grid[x][y + 1]

        if (!cellE.cw) {
            this.restore(x + 1, y)
        }
        if (!cellS.cn) {
            this.restore(x, y + 1)
        }
        if (!cell.cw) {
            this.restore(x - 1, y)
        }
        if (!cell.cn) {
            this.restore(x, y - 1)
        }
    }

    levelComplete() {
        for (let i = 0; i < this.size.w; i++) {
            for (let j = 0; j < this.size.h; j++) {
                
            }
        }
        return false
    }





    firstLevel() {
        this.goToLevel(0)
    }

    previousLevel() {
        if (this.currentLevel === 0) return
        this.goToLevel(this.currentLevel - 1)
    }

    resetLevel() {
        this.goToLevel(this.currentLevel)
    }

    nextLevel() {
        if (this.currentLevel === this.levels.length - 1) return
        this.goToLevel(this.currentLevel + 1)
    }

    lastLevel() {
        this.goToLevel(this.levels.length - 1)
    }

    goToLevel(level: number) {
        this.currentLevel = level
        this.loadLevelData(this.levels[level])
    }

    inBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.size.w && y >= 0 && y < this.size.h
    }

    canFall(x: number, y: number): boolean {
        return x > 0 && y > 0 && x < this.size.w - 1 && y < this.size.h - 1
    }









    refresh() {
        this.updateDisplayInfo()
        this.render()
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.renderPaper()
        this.renderLines()
        this.renderCuts()
        this.renderPlayer()
    }

    renderPaper() {
        this.ctx.fillStyle = '#e0c0a0'
        
        const w = this.size.w
        const h = this.size.h
        const size = this.cellSize
        const rect = this.displayRect
        const grid = this.grid
        const ctx = this.ctx

        ctx.beginPath()
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (grid[i][j].fallen) continue

                const x = rect.x + i * size
                const y = rect.y + j * size
                ctx.rect(x, y, size, size)
            }
        }
        ctx.fill()
    }

    renderLines() {
        const w = this.size.w
        const h = this.size.h
        const size = this.cellSize
        const rect = this.displayRect
        const grid = this.grid
        const ctx = this.ctx
        ctx.strokeStyle = '#8404'
        ctx.lineWidth = size * 0.0125
        ctx.lineCap = 'round'

        ctx.beginPath()
        
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const cell = grid[i][j]
                if (cell.fallen) continue

                const x = rect.x + i * size
                const y = rect.y + j * size
                const x1 = x + size
                const y1 = y + size
                if (cell.lw) {
                    ctx.moveTo(x, y)
                    ctx.lineTo(x, y1)
                }
                if (cell.ln) {
                    ctx.moveTo(x, y)
                    ctx.lineTo(x1, y)
                }
            }
        }
        ctx.stroke()
    }

    renderCuts() {
        const w = this.size.w
        const h = this.size.h
        const size = this.cellSize
        const rect = this.displayRect
        const grid = this.grid
        const ctx = this.ctx
        ctx.strokeStyle = '#000'
        ctx.lineWidth = size * 0.025
        ctx.lineCap = 'round'

        ctx.beginPath()
        
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const cell = grid[i][j]
                const x = rect.x + i * size
                const y = rect.y + j * size
                const x1 = x + size
                const y1 = y + size
                if (cell.cw) {
                    ctx.moveTo(x, y)
                    ctx.lineTo(x, y1)
                }
                if (cell.cn) {
                    ctx.moveTo(x, y)
                    ctx.lineTo(x1, y)
                }
            }
        }
        ctx.stroke()
    }

    renderPlayer() {
        this.ctx.fillStyle = '#000'
        const size = this.cellSize
        const x = this.displayRect.x + this.player.x * size
        const y = this.displayRect.y + this.player.y * size
        const radius = size * 0.0625
        this.ctx.beginPath()
        this.ctx.arc(x, y, radius, 0, TAU)
        this.ctx.fill()
    }

    updateDisplayInfo() {
        const w                 = this.canvas.clientWidth
        const h                 = this.canvas.clientHeight
        this.canvas.width       = w
        this.canvas.height      = h
        const gameW             = this.size.w
        const gameH             = this.size.h
        const horizontalDisplay = w * gameH > h * gameW

        this.cellSize           = Math.floor(horizontalDisplay ? h / gameH : w / gameW)
        this.displayRect.w      = gameW * this.cellSize
        this.displayRect.h      = gameH * this.cellSize
        this.displayRect.x      = Math.floor((w - this.displayRect.w) / 2)
        this.displayRect.y      = Math.floor((h - this.displayRect.h) / 2)
    }
}