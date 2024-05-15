export const wall = [
    ['blue','yellow','red','black','azure'],
    ['azure','blue','yellow','red','black'],
    ['black','azure','blue','yellow','red'],
    ['red','black','azure','blue','yellow'],
    ['yellow','red','black','azure','blue'],
]

export const wallTileAtIndexes = (rowInd, colInd) => {
    return wall[rowInd][colInd];
}

export const indexForColorAtRow = (color, rowInd) => {
    return wall[rowInd].indexOf(color);
}