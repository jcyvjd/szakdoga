import { useEffect, useRef } from "react";


const AnimateChanges = (previousState, currentState) => {
    if (!previousState || !currentState) return null;
    console.log("AnimateChanges", previousState, currentState);
    try {
        const playerId = previousState.playerToMove;

        let prevMarket = null;
        let marketId = null;
        for(let i = 0; i < previousState.markets.length; i++){
            if(JSON.stringify(previousState.markets[i]) !== JSON.stringify(currentState.markets[i])){
                prevMarket = previousState.markets[i];
                marketId = i;
                break;
            }
        }
        if(prevMarket === null){
            if(previousState.sharedMarket !== currentState.sharedMarket){
                prevMarket = previousState.sharedMarket;
                marketId = -1;
            }else{
                //return null;
            }
        }
        //ha prevMarket null, akkor nem takeTile tortent (talan korVege)
        //eloszor ha nem null akkor meganimaljuk a takeTile-t
        if(prevMarket !== null){
            //market to playerBoard.collectedTiles
            console.log("PlayerId", playerId);

            const prevPlayerBoard = previousState.playerBoards.find(playerBoard => playerBoard.playerId._id === playerId);
            console.log("prevPlayerBoard", prevPlayerBoard);
            const currentPlayerBoard = currentState.playerBoards.find(playerBoard => playerBoard.playerId._id === playerId);
            for(let row = 0; row < prevPlayerBoard.collectedTiles.length; ++row){
                for(let tileInd = 0; tileInd < prevPlayerBoard.collectedTiles[row].length; ++tileInd)
                {
                    if (prevPlayerBoard.collectedTiles[row][tileInd] !== currentPlayerBoard.collectedTiles[row][tileInd]) {
                        handleTileMove({
                            from: { marketId, index : prevMarket.indexOf(currentPlayerBoard.collectedTiles[row][tileInd])},
                            to: { playerBoardId: prevPlayerBoard._id, type: 'collected', index: `${row}${tileInd}`}
                        })
                        prevMarket[prevMarket.indexOf(currentPlayerBoard.collectedTiles[row][tileInd])] = 'empty';
                    }
                }
            }
            //to floor tiles
            for(let tileInd = 0; tileInd < prevPlayerBoard.floorTiles.length; ++tileInd){
                if(prevPlayerBoard.floorTiles[tileInd] !== currentPlayerBoard.floorTiles[tileInd]){
                    handleTileMove({
                        from: { marketId, index : prevMarket.indexOf(currentPlayerBoard.floorTiles[tileInd])},
                        to: { playerBoardId: prevPlayerBoard._id, type: 'floor', index: tileInd}
                    })
                    prevMarket[prevMarket.indexOf(currentPlayerBoard.floorTiles[tileInd])] = 'empty';
                }
            }
        }
        //ha prevMarket null, akkor nem takeTile tortent (talan korVege)
    } catch (error) {
        console.error(error);
    }

  return null; // You can return any necessary cleanup function or value
};

const handleTileMove = (data) => {
    console.log("MoveTile", data);
    const { from, to } = data;
    const { marketId, index: fromIndex } = from;
    const { playerBoardId, type: toType, index: toIndex } = to;
console.log("Still MOVING")
    // Get the fromElement based on the marketId and fromIndex
    const fromElement = document.getElementById(`market-${marketId}-tile-${fromIndex}`);
    console.log("fromIndex", fromIndex)
    console.log("fromElementId", `market-${marketId}-tile-${fromIndex}`);

    let toElementId;
    if (toType === 'collected') {
        const rowIndex = Math.floor(toIndex / 10);
        const colIndex = toIndex % 10;
        toElementId = `playerBoard-${playerBoardId}-col-${rowIndex}-tile-${colIndex}`;
        console.log("toElementId", toElementId);
    } else if (toType === 'wall') {
        const rowIndex = Math.floor(toIndex / 10);
        const colIndex = toIndex % 10;
        toElementId = `playerBoard-${playerBoardId}-wall-${rowIndex}-tile-${colIndex}`;
        console.log("toElementId", toElementId);

    } else if (toType === 'floor') {
        toElementId = `playerBoard-${playerBoardId}-floor-tile-${toIndex}`;
        console.log("toElementId", toElementId);

    }

    const toElement = document.getElementById(toElementId);
    console.log("fromElement", fromElement);
    console.log("toElement", toElement);

    if (fromElement && toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        console.log("fromRect", fromRect);
        console.log("toRect", toRect);

        // Create a temporary element for the animation
        const tempTile = fromElement.cloneNode(true);
        tempTile.style.position = 'absolute';
        tempTile.style.top = `${fromRect.top}px`;
        tempTile.style.left = `${fromRect.left}px`;
        tempTile.style.width = `${fromRect.width}px`;
        tempTile.style.height = `${fromRect.height}px`;
        document.body.appendChild(tempTile);

        // Animate the tile movement
        tempTile.animate([
            { transform: `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)` }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        }).onfinish = () => {
            document.body.removeChild(tempTile);
            // You might want to update the game state here to reflect the new tile position
        };
    }
};

export default AnimateChanges;



/*
const handleTileMove = (data) => {
            console.log("MoveTile", data);
            const { from, to } = data;
            const { marketId, index: fromIndex } = from;
            const { playerBoardId, type: toType, index: toIndex } = to;

            // Get the fromElement based on the marketId and fromIndex
            const fromElement = document.getElementById(`market-${marketId}-tile-${fromIndex}`);
            console.log("fromIndex", fromIndex)
            console.log("fromElementId", `market-${marketId}-tile-${fromIndex}`);

            let toElementId;
            if (toType === 'collected') {
                const rowIndex = Math.floor(toIndex / 10);
                const colIndex = toIndex % 10;
                toElementId = `playerBoard-${playerBoardId}-col-${rowIndex}-tile-${colIndex}`;
                console.log("toElementId", toElementId);
            } else if (toType === 'wall') {
                const rowIndex = Math.floor(toIndex / 10);
                const colIndex = toIndex % 10;
                toElementId = `playerBoard-${playerBoardId}-wall-${rowIndex}-tile-${colIndex}`;
                console.log("toElementId", toElementId);

            } else if (toType === 'floor') {
                toElementId = `playerBoard-${playerBoardId}-floor-tile-${toIndex}`;
                console.log("toElementId", toElementId);

            }

            const toElement = document.getElementById(toElementId);
            console.log("fromElement", fromElement);
            console.log("toElement", toElement);

            if (fromElement && toElement) {
                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();
                console.log("fromRect", fromRect);
                console.log("toRect", toRect);

                // Create a temporary element for the animation
                const tempTile = fromElement.cloneNode(true);
                tempTile.style.position = 'absolute';
                tempTile.style.top = `${fromRect.top}px`;
                tempTile.style.left = `${fromRect.left}px`;
                tempTile.style.width = `${fromRect.width}px`;
                tempTile.style.height = `${fromRect.height}px`;
                document.body.appendChild(tempTile);

                // Animate the tile movement
                tempTile.animate([
                    { transform: `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)` }
                ], {
                    duration: 500,
                    easing: 'ease-in-out'
                }).onfinish = () => {
                    document.body.removeChild(tempTile);
                    // You might want to update the game state here to reflect the new tile position
                };
            }
*/