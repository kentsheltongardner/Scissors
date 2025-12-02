import Cell from './cell.js';
export const basicLevelsData = [
    `{
        "player": {
            "x": 1,
            "y": 1
        },
        "grid": [
            [
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":true,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":true,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":true,"cw":false,"cn":false,"fallen":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":true,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":true,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":true,"cw":false,"cn":false,"fallen":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":true,"ln":false,"cw":false,"cn":false,"fallen":false},
                {"lw":false,"ln":false,"cw":false,"cn":false,"fallen":false}
            ]
        ]
    }`,
];
export const paletteLevelData = [
    `{
        "player": {
            "x": 1,
            "y": 1
        },
        "grid": [
            [
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false}
            ],
            [
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false},
                {"lw":false,"ln":false,"cw":false,"cn":false}
            ]
        ]
    }`,
];
export function blankGrid(w, h) {
    const grid = new Array(w).fill(0).map(() => new Array(h).fill(0).map(() => new Cell()));
    for (let i = 1; i < w - 1; i++) {
        for (let j = 1; j < h - 1; j++) {
            grid[i][j] = new Cell(true, true, false, false);
        }
    }
    for (let i = 1; i < w - 1; i++) {
        grid[i][h - 1].ln = true;
    }
    for (let j = 1; j < h - 1; j++) {
        grid[w - 1][j].lw = true;
    }
    return JSON.stringify({
        "player": {
            "x": 1,
            "y": 1
        },
        "grid": grid
    });
}
//# sourceMappingURL=levels.js.map