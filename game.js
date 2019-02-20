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

let selectedUnit = new Unit(Dwarf, {'x': 1, 'y': 1}, 'blue');

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
