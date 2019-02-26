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
let playerAInventory = {
    'knight': 3,
    'elf': 3,
    'dwarf': 3
}
let playerBInventory = {
    'knight': 3,
    'elf': 3,
    'dwarf': 3
}

let unitToAdd;

let playerAUnits = [ ]

let playerBUnits = [ ]

let selectedUnit;
let modes = {
    'select': 0,
    'move': 1,
    'attack': 2,
    "add": 3
}
let mode = modes.add;

let onMove = 'playerA';

$('#wrapper').css('text-align', 'center');
canvas.attr({'width': canvasWidth, 'height': canvasHeight}).css({
    'border': '1px solid black',
    'display': 'inline-block'}).on('click', function(ev) {
        let clickedBlock = {
            'x': Math.trunc(ev.offsetX / boxWidth),
            'y': Math.trunc(ev.offsetY / boxHeight)
        }
        switch (mode) {
            case modes.add:
                let inPlayerAField = (clickedBlock['y'] == 0) || (clickedBlock['y'] == 1);
                let inPlayerBField = (clickedBlock['y'] == 5) || (clickedBlock['y'] == 6);
                switch(unitToAdd) {
                    case Knight:
                        if ((onMove == 'playerA') && inPlayerAField && (playerAInventory['knight'] > 0)) {
                            playerAUnits.push(new Unit(Knight, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerA'));
                            playerAInventory['knight'] -= 1;
                            $('#knights').text = playerAInventory['knight'];
                        } else if ((onMove == 'playerB') && inPlayerBField && (playerBInventory['knight'] > 0)) {
                            playerBUnits.push(new Unit(Knight, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerB'));
                            playerBInventory['knight'] -= 1;
                        }
                        break;
                    case Dwarf:
                        if ((onMove == 'playerA') && inPlayerAField && (playerAInventory['dwarf'] > 0)) {
                            playerAUnits.push(new Unit(Dwarf, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerA'));
                            playerAInventory['dwarf'] -= 1;
                            $('#dwarves').text = playerAInventory['dwarf'];
                        } else if ((onMove == 'playerB') && inPlayerBField && (playerBInventory['dwarf'] > 0)) {
                            playerBUnits.push(new Unit(Dwarf, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerB'));
                            playerBInventory['dwarf'] -= 1;
                        }
                        break;
                    case Elf:
                        if ((onMove == 'playerA') && inPlayerAField && (playerAInventory['elf'] > 0)) {
                            playerAUnits.push(new Unit(Elf, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerA'));
                            playerAInventory['elf'] -= 1;
                            $('#elves').text = playerAInventory['elf'];
                        } else if ((onMove == 'playerB') && inPlayerBField && (playerBInventory['elf'] > 0)) {
                            playerBUnits.push(new Unit(Elf, {'x': clickedBlock['x'], 'y': clickedBlock['y']}, 'playerB'));
                            playerBInventory['elf'] -= 1;
                        }
                        break;
                }

                playerAInventoryEmpty = (playerAInventory['knight'] == 0) && (playerAInventory['dwarf'] == 0) && (playerAInventory['elf'] == 0)
                playerBInventoryEmpty = (playerBInventory['knight'] == 0) && (playerBInventory['dwarf'] == 0) && (playerBInventory['elf'] == 0)
                if (playerAInventoryEmpty)
                    onMove = 'playerB'
                
                if (playerBInventoryEmpty) {
                    mode = modes.select;
                    onMove = 'playerA';
                }

                redraw();
                break;
            case modes.select:
                if (onMove == 'playerA') {
                    playerAUnits.some((unit) => {
                        if ((unit.position['x'] == clickedBlock['x']) && (unit.position['y'] == clickedBlock['y'])) {
                            selectedUnit = unit;
                            return;
                        }
                    })
                } else {
                    playerBUnits.some((unit) => {
                        if ((unit.position['x'] == clickedBlock['x']) && (unit.position['y'] == clickedBlock['y'])) {
                            selectedUnit = unit;
                            return;
                        }
                    })
                }

                redraw();
                break;
            case modes.move:
                let reachableBoxes = getReachableMovementBoxes();
                reachableBoxes.some((box) => {
                    if ((box['x'] == clickedBlock['x']) && (box['y'] == clickedBlock['y'])) {
                        selectedUnit.move(clickedBlock);
                        return;
                    }
                });

                redraw();
                break;
            case modes.attack:
                let reachableEnemies = getReachableEnemies();
                reachableEnemies.some((enemy) => {
                    if ((enemy.position['x'] == clickedBlock['x']) && (enemy.position['y'] == clickedBlock['y'])) {
                        selectedUnit.attack(enemy);
                    }
                })
                break;
        }
    });

$('#wrapper').add('div').id('buttons').css({
    'display': 'inline-block',
    'vertical-align': 'top',
});
$('#buttons').add('div').add('button').attr('type', 'button').id('attackButton').css({
    'display': 'inline-block',
    'padding': '5px',
    'margin': '20px'
}).text('Attack').on('click', function(ev) {
    if (mode != modes.add)
        mode = modes.attack;
    redraw();
});
$('#buttons').add('div').add('button').attr('type', 'button').id('moveButton').css({
    'display': 'inline-block',
    'padding': '5px',
    'margin': '20px'
}).text('Move').on('click', function(ev) {
    if (mode != modes.add)
        mode = modes.move;
    redraw();
});
$('#buttons').add('div').add('button').attr('type', 'button').id('healButton').css({
    'display': 'inline-block',
    'padding': '5px',
    'margin': '20px'
}).text('Heal').on('click', function(ev) {
    if (mode != modes.add)
        selectedUnit.heal();
    mode = modes.select;
});
$('#wrapper').add('div').id('heroes').css({
    'display': 'inline-block',
    'vertical-align': 'bottom',
    'text-align': 'left',
});
$('#heroes').add('div').id('knights').text(playerAInventory['knight']).on('click', function(ev) {
    unitToAdd = Knight;
});
$('#heroes').add('div').id('elves').text(playerAInventory['elf']).on('click', function(ev) {
    unitToAdd = Elf;
});
$('#heroes').add('div').id('dwarves').text(playerAInventory['dwarf']).on('click', function(ev) {
    unitToAdd = Dwarf
});

$('#heroes > div').each((el) => {
    el.css({
        'float': 'left',
        'border': '2px solid black',
        'padding': '5px',
        'user-select': 'none',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none'
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        mode = modes.select;
        redraw();
    }
})

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
        switch (unit.characterClass) {
            case Knight:
                unitText = 'K';
                break;
            case Dwarf:
                unitText = 'D';
                break;
            case Elf:
                unitText = 'E';
                break;
        }

        centerPoint = {
            'x': ((unit.position['x'] * boxWidth) + (boxWidth / 2)),
            'y': ((unit.position['y'] * boxHeight) + (boxHeight / 2))
        }
        let textColor = "#0000ff";
        ctx.font = '32px "Comic Sans MS"';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.translate((unit.position['x'] * boxWidth), (unit.position['y'] * boxHeight));
        ctx.fillStyle = textColor;
        ctx.fillText(unitText, (boxWidth / 2), (boxHeight / 2));
        ctx.translate(-(unit.position['x'] * boxWidth), -(unit.position['y'] * boxHeight));
    });

    playerBUnits.forEach((unit) => {
        switch (unit.characterClass) {
            case Knight:
                unitText = 'K';
                break;
            case Dwarf:
                unitText = 'D';
                break;
            case Elf:
                unitText = 'E';
                break;
        }

        centerPoint = {
            'x': ((unit.position['x'] * boxWidth) + (boxWidth / 2)),
            'y': ((unit.position['y'] * boxHeight) + (boxHeight / 2))
        }
        let textColor = "#ff0000";
        ctx.font = '32px "Comic Sans MS"';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.translate((unit.position['x'] * boxWidth), (unit.position['y'] * boxHeight));
        ctx.fillStyle = textColor;
        ctx.fillText(unitText, (boxWidth / 2), (boxHeight / 2));
        ctx.translate(-(unit.position['x'] * boxWidth), -(unit.position['y'] * boxHeight));
    });

}

function drawOverlay() {
    if (!selectedUnit) return;

    overlayBackgroundColor = '#ffffff';
    pathBackgroundColor = '#dddddd';
    textColor = "#000000";
    ctx.font = '22px "Comic Sans MS"';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    switch (mode) {
        case modes.select:
            break;
        case modes.move:
            let reachableBoxes = getReachableMovementBoxes()
            reachableBoxes.forEach((box) => {
                ctx.fillStyle = overlayBackgroundColor;
                ctx.fillRect((box['x'] * boxWidth), (box['y'] * boxHeight), boxWidth, boxHeight);

                ctx.translate((box['x'] * boxWidth), (box['y'] * boxHeight));
                ctx.fillStyle = textColor;
                ctx.fillText(box['distance'].toString(), (boxWidth / 2), (boxHeight / 2));
                ctx.translate(-(box['x'] * boxWidth), -(box['y'] * boxHeight));
            });
            break;
        case modes.attack:
            let reachableEnemies = getReachableEnemies();
            reachableEnemies.forEach((enemy) => {
                if (enemy.position['x'] == selectedUnit.position['x']) {
                    let x = enemy.position['x'];
                    gameBoard.forEach((row, y) => {
                        let rowBetweenPlayerEnemy = (Math.min(selectedUnit.position['y'], enemy.position['y']) < y) && (y < Math.max(selectedUnit.position['y'], enemy.position['y']));

                        if (rowBetweenPlayerEnemy) {
                            let mmi = Math.min(selectedUnit.position['y'], enemy.position['y']);
                            let mma = Math.max(selectedUnit.position['y'], enemy.position['y']);
                            ctx.fillStyle = overlayBackgroundColor;
                            ctx.fillRect((x * boxWidth), (y * boxHeight), boxWidth, boxHeight);
                        }
                    })
                } else if (enemy.position['y'] == selectedUnit.position['y']) {
                    let y = enemy.position['y'];
                    gameBoard[y].forEach((column, x) => {
                        let columnBetweenPlayerEnemy = (Math.min(selectedUnit.position['x'], enemy.position['x']) < x) && (x < Math.max(selectedUnit.position['x'], enemy.position['x']));

                        if (columnBetweenPlayerEnemy) {
                            ctx.fillStyle = overlayBackgroundColor;
                            ctx.fillRect((x * boxWidth), (y * boxHeight), boxWidth, boxHeight);
                        }
                    })
                }
            });
            break;
    }
}

function redraw() {
    drawBoard();
    drawUnits();
    drawOverlay();
    if (onMove == 'playerA') {
        $('#knights').text(playerAInventory['knight']);
        $('#dwarves').text(playerAInventory['dwarf']);
        $('#elves').text(playerAInventory['elf']);
    } else {
        $('#knights').text(playerBInventory['knight']);
        $('#dwarves').text(playerBInventory['dwarf']);
        $('#elves').text(playerBInventory['elf']);
    }
};

function getReachableMovementBoxes() {
    let reachableBoxes = [];
    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            let distance = Math.abs(selectedUnit.position['x'] - x) + Math.abs(selectedUnit.position['y'] - y);
            let reachable = (distance <= selectedUnit.characterClass.movementSpeed) && (distance != 0);

            let noUnits = true;
            playerAUnits.some((unit) => {
                if ((unit.position['x'] == x) && (unit.position['y'] == y)) {
                    noUnits = false;
                    return;
                }
            });
            playerBUnits.some((unit) => {
                if ((unit.position['x'] == x) && (unit.position['y'] == y)) {
                    noUnits = false;
                    return;
                }
            })

            if (reachable && noUnits) {
                reachableBoxes.push({
                    'x': x,
                    'y': y,
                    'distance': distance
                })
            }
        }
    }

    return reachableBoxes;
}

function getReachableEnemies() {
    let reachableEnemies = [];
    let reachableAttackBoxes = [];
    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            if ((x != selectedUnit.position['x']) && (y != selectedUnit.position['y']))
                continue;

            let distance = 0;
            if (x == selectedUnit.position['x']) {
                distance = Math.abs(selectedUnit.position['y'] - y);
            } else if (y == selectedUnit.position['y']) {
                distance = Math.abs(selectedUnit.position['x'] - x);
            }
            let reachable = (distance <= selectedUnit.characterClass.reach) && (distance != 0);

            if (reachable) {
                reachableAttackBoxes.push({
                    'x': x,
                    'y': y
                })
            }
        }
    }

    reachableAttackBoxes.forEach((box) => {
        if (onMove == 'playerA') {
            playerBUnits.forEach((unit) => {
                if ((box['x'] == unit.position['x']) && (box['y'] == unit.position['y'])) {
                    reachableEnemies.push(unit);
                }
            });
        } else if (onMove == 'playerB') {
            playerAUnits.forEach((unit) => {
                if ((box['x'] == unit.position['x']) && (box['y'] == unit.position['y'])) {
                    reachableEnemies.push(unit);
                }
            });
        }
    });
    
    return reachableEnemies;
}

redraw();
