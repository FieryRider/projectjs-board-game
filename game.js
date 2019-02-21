var canvas = $('#canvas')
var canvasWidth = 800;
var canvasHeight = 600;
var boxWidth = canvasWidth / 9;
var boxHeight = canvasHeight / 7;

/* 1 - Player1
 * 2 - Player2
 * 0 - Battlefield
 */
let gameBoard = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2]
]

let playerAUnits = [
    new Unit(Knight, {'x': 0, 'y': 1}, 'playerA'),
    new Unit(Elf, {'x': 4, 'y': 0}, 'playerA'),
    new Unit(Knight, {'x': 1, 'y': 1}, 'playerA'),
    new Unit(Dwarf, {'x': 8, 'y': 1}, 'playerA'),
    new Unit(Dwarf, {'x': 7, 'y': 0}, 'playerA'),
    new Unit(Elf, {'x': 3, 'y': 1}, 'playerA'),
    new Unit(Knight, {'x': 5, 'y': 0}, 'playerA'),
    new Unit(Dwarf, {'x': 6, 'y': 1}, 'playerA'),
    new Unit(Elf, {'x': 2, 'y': 1}, 'playerA'),
]

let playerBUnits = [
    new Unit(Knight, {'x': 0, 'y': 5}, 'playerB'),
    new Unit(Elf, {'x': 1, 'y': 6}, 'playerB'),
    new Unit(Knight, {'x': 2, 'y': 6}, 'playerB'),
    new Unit(Dwarf, {'x': 8, 'y': 5}, 'playerB'),
    new Unit(Dwarf, {'x': 7, 'y': 6}, 'playerB'),
    new Unit(Elf, {'x': 3, 'y': 6}, 'playerB'),
    new Unit(Knight, {'x': 4, 'y': 5}, 'playerB'),
    new Unit(Dwarf, {'x': 6, 'y': 5}, 'playerB'),
    new Unit(Elf, {'x': 5, 'y': 6}, 'playerB'),
]

let selectedUnit;

canvas.attr({'width': canvasWidth, 'height': canvasHeight}).css({
    'border': '1px solid black',
    'display': 'block',
    'padding-left': '0',
    'padding-right': '0',
    'margin-left': 'auto',
    'margin-right': 'auto'}).on('click', function(ev) {
        console.log(`X: ${ev.offsetX} Y: ${ev.offsetY}`);
    });

let ctx = canvas[0].getContext('2d');

function drawBoard() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    let white = true;
    gameBoard.forEach((y, yIdx) => {
        y.forEach((x, xIdx) => {
            switch (x) {
                case 0:
                    ctx.fillStyle = '#dfdfdf';
                    break;
                case 1:
                    if (white)
                        ctx.fillStyle = '#d0d0d0';
                    else
                        ctx.fillStyle = '#555555';

                    white = !white;
                    break;
                case 2:
                    if (white)
                        ctx.fillStyle = '#555555';
                    else
                        ctx.fillStyle = '#d0d0d0';

                    white = !white;
                    break;
            }

            ctx.fillRect((xIdx * boxWidth), (yIdx * boxHeight), boxWidth, boxHeight);
        });
    });
}

function drawUnits() {
    playerAUnits.forEach((unit) => {
        let color;
        switch (unit.characterClass) {
            case Knight:
                color = '#ff0000';
                break;
            case Dwarf:
                color = '#00ff00';
                break;
            case Elf:
                color = '#ffc0cb';
                break;
        }

        centerPoint = {
            'x': ((unit.position['x'] * boxWidth) + (boxWidth / 2)),
            'y': ((unit.position['y'] * boxHeight) + (boxHeight / 2))
        }
        ctx.beginPath()
        ctx.ellipse(centerPoint['x'], centerPoint['y'], (boxWidth / 4), (boxHeight / 4), 0, 0, Math.PI*4);
        ctx.fillStyle = color;
        ctx.fill();
    });

    playerBUnits.forEach((unit) => {
        let color;
        switch (unit.characterClass) {
            case Knight:
                color = '#ff0000';
                break;
            case Dwarf:
                color = '#00ff00';
                break;
            case Elf:
                color = '#ffc0cb';
                break;
        }

        centerPoint = {
            'x': ((unit.position['x'] * boxWidth) + (boxWidth / 2)),
            'y': ((unit.position['y'] * boxHeight) + (boxHeight / 2))
        }
        ctx.beginPath()
        ctx.ellipse(centerPoint['x'], centerPoint['y'], (boxWidth / 4), (boxHeight / 4), 0, 0, Math.PI*4);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

function drawOverlay() {
    if (!selectedUnit) return;

    overlayBackgroundColor = '#ffffff';
    textColor = "#000000";
    ctx.font = '22px "Comic Sans MS"';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            let distance = Math.abs(selectedUnit.position['x'] - x) + Math.abs(selectedUnit.position['y'] - y);
            let reachable = (distance <= selectedUnit.characterClass.movementSpeed) && (distance != 0);

            if (reachable) {
                ctx.fillStyle = overlayBackgroundColor;
                ctx.fillRect((x * boxWidth), (y * boxHeight), boxWidth, boxHeight);

                ctx.translate((x * boxWidth), (y * boxHeight));
                ctx.fillStyle = textColor;
                ctx.fillText(distance.toString(), (boxWidth / 2), (boxHeight / 2));
                ctx.translate(-(x * boxWidth), -(y * boxHeight));
            }
        }
    }
}

function redraw() {
    drawBoard();
    drawOverlay();
};

redraw();
