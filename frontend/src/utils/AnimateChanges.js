import { useEffect, useRef } from "react";


export const animateTakeTiles = (previousState, currentState) => {
    if (!previousState || !currentState) return null;
    console.log("AnimateTakeTiles", previousState, currentState);
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
            if(JSON.stringify(previousState.sharedMarket) !== JSON.stringify(currentState.sharedMarket)){
                prevMarket = previousState.sharedMarket;
                marketId = -1;
            }else{
                return null;
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
                        const fromElementId = `market-${marketId}-tile-${prevMarket.indexOf(currentPlayerBoard.collectedTiles[row][tileInd])}`;
                        const toElementId = `playerBoard-${prevPlayerBoard._id}-col-${row}-tile-${tileInd}`;
                        handleTileMove({
                            fromElementId,
                            toElementId,
                        })
                        prevMarket[prevMarket.indexOf(currentPlayerBoard.collectedTiles[row][tileInd])] = 'empty';
                    }
                }
            }
            //market to floor tiles
            for(let tileInd = 0; tileInd < prevPlayerBoard.floorTiles.length; ++tileInd){
                if(prevPlayerBoard.floorTiles[tileInd] !== currentPlayerBoard.floorTiles[tileInd]){
                    const fromElementId = `market-${marketId}-tile-${prevMarket.indexOf(currentPlayerBoard.floorTiles[tileInd])}`;
                    const toElementId = `playerBoard-${prevPlayerBoard._id}-floor-tile-${tileInd}`;
                    handleTileMove({
                        fromElementId,
                        toElementId,
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


//kap egy toElementId-t, es egy fromElementId-t, es animacioval mozgatja a fromElementId-t a toElementId-re
const handleTileMove = (data) => {
    try {
        console.log("MoveTile", data);
        const { fromElementId, toElementId } = data;

        console.log("Still MOVING")

        const fromElement = document.getElementById(fromElementId);
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
            };
        }
    } catch (error) {
        console.error(error);
    }
};

