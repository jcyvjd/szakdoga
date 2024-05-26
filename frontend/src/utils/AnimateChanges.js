import { useState, useEffect } from "react";

import tile_red from '../assets/tiles/tile_red.png';
import tile_blue from '../assets/tiles/tile_blue.png';
import tile_azure from '../assets/tiles/tile_azure.png';
import tile_black from '../assets/tiles/tile_black.png';
import tile_yellow from '../assets/tiles/tile_yellow.png';
import tile_white from '../assets/tiles/tile_white.png';

const WallTilePattern = [
    ['blue', 'yellow', 'red', 'black', 'azure'],
    ['azure', 'blue', 'yellow', 'red', 'black'],
    ['black', 'azure', 'blue', 'yellow', 'red'],
    ['red', 'black', 'azure', 'blue', 'yellow'],
    ['yellow', 'red', 'black', 'azure', 'blue'],
  ];

export const animateTakeTiles = (previousState, currentState) => {
    if (!previousState || !currentState) return null;
    //if (!validateGameState(previousState) || !validateGameState(currentState)) return null;
    console.log("AnimateTakeTiles", previousState, currentState);
    try {
        const animations = [];
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
                        
                        animations.push({ fromElementId, toElementId });

                        prevMarket[prevMarket.indexOf(currentPlayerBoard.collectedTiles[row][tileInd])] = 'empty';
                    }
                }
            }
            //market to floor tiles
            for(let tileInd = 0; tileInd < prevPlayerBoard.floorTiles.length; ++tileInd){
                if(prevPlayerBoard.floorTiles[tileInd] !== currentPlayerBoard.floorTiles[tileInd]){
                    const fromElementId = `market-${marketId}-tile-${prevMarket.indexOf(currentPlayerBoard.floorTiles[tileInd])}`;
                    const toElementId = `playerBoard-${prevPlayerBoard._id}-floor-tile-${tileInd}`;
                    
                    //setAnimationQueue([...animationQueue, { fromElementId, toElementId }]);
                    animations.push({ fromElementId, toElementId });
                    prevMarket[prevMarket.indexOf(currentPlayerBoard.floorTiles[tileInd])] = 'empty';
                }
            }
            //rest of the market to sharedMarket
            if(marketId !== -1)
            {    
                for(let tileInd = 0; tileInd < prevMarket.length; ++tileInd){
                    if(prevMarket[tileInd] !== 'empty'){
                        const fromElementId = `market-${marketId}-tile-${tileInd}`;
                        const middleIndex = Math.floor(prevMarket.length / 2);
                        const toElementId = `market-${-1}-tile-${middleIndex}`;
                        //const toElementId = `market-${-1}-tile-${lastSharedIndexPlusOne}`;
                        
                        animations.push({ fromElementId, toElementId });
                        prevMarket[tileInd] = 'empty';
                    }
                }
            }
            animations.forEach((animation) => {
                //setTimeout(() => {
                    handleTileMove(animation);
                //}, 500);
            });
        }
        //ha prevMarket null, akkor nem takeTile tortent (talan korVege)
    } catch (error) {
        console.error(error);
    }

  return null; // You can return any necessary cleanup function or value
};

export const animateRoundOver = (previousState, currentState) => {
    if (!previousState || !currentState) return null;
    console.log("AnimateRoundOver", previousState, currentState);
    try {
        const animations = [];
        // Iterate through player boards to find differences
        for (let playerBoardIndex = 0; playerBoardIndex < currentState.playerBoards.length; playerBoardIndex++) {
            const prevPlayerBoard = previousState.playerBoards[playerBoardIndex];
            const currentPlayerBoard = currentState.playerBoards[playerBoardIndex];

            // Iterate through collected tiles rows
            for (let row = 0; row < prevPlayerBoard.collectedTiles.length; ++row) {
                const prevCollectedTilesRow = prevPlayerBoard.collectedTiles[row];
                const currentCollectedTilesRow = currentPlayerBoard.collectedTiles[row];

                // Check if the collected tiles row has changed
                // ha mar az elso elem prev !== empty es current elso === empty , kell mozgatni
                if ((prevCollectedTilesRow[0] !== 'empty') && (currentCollectedTilesRow[0] === 'empty')) {
                    // Find the last element to move to the wall position
                    const lastElement = prevCollectedTilesRow[prevCollectedTilesRow.length - 1];
                    const lastElementIndex = prevCollectedTilesRow.indexOf(lastElement);

                    const wallIndex = WallTilePattern[row].indexOf(lastElement);
                    console.log("ROUNDOVER wallIndex", wallIndex);
                    if (lastElement !== undefined && lastElementIndex !== -1) {
                        const fromElementId = `playerBoard-${prevPlayerBoard._id}-col-${row}-tile-${lastElementIndex}`;
                        const toElementId = `playerBoard-${prevPlayerBoard._id}-wall-${row}-tile${wallIndex}`;

                        animations.push({ fromElementId, toElementId });

                        // Animate the rest of the collected tiles to the shared market center
                        for (let tileInd = 0; tileInd < prevCollectedTilesRow.length; ++tileInd) {
                            if (tileInd !== lastElementIndex && prevCollectedTilesRow[tileInd] !== 'empty') {
                                const fromElementId = `playerBoard-${prevPlayerBoard._id}-col-${row}-tile-${tileInd}`;
                                // const smMiddleIndex = Math.floor(previousState.sharedMarket.length / 2);
                                // const toElementId = `market-${-1}-tile-${smMiddleIndex}`;
                                // animations.push({ fromElementId, toElementId });
                                const fromElement = document.getElementById(fromElementId);
                                if (fromElement) {
                                    fromElement.style.transition = 'background-image 0.5s';
                                    fromElement.style.backgroundImage = 'none';
                                }
                                
                            }
                        }
                    }
                }
            }
        }
        animations.forEach((animation) => {
            console.log("ANIMATION ROUND OVER", animation);
            handleTileMove(animation);
        });
    } catch (error) {
        console.error(error);
    }

    return null;
};

const getBGImage = (tile) => {
    switch (tile) {
        case 'red':
            return `url(${tile_red})`;
        case 'blue':
            return `url(${tile_blue})`;
        case 'azure':
            return `url(${tile_azure})`;
        case 'black':
            return `url(${tile_black})`;
        case 'yellow':
            return `url(${tile_yellow})`;
        case 'white':
            return `url(${tile_white})`;
        default:
            return 'none';
    }
};

export const animateNewRound = (previousState, currentState) => {
    if (!previousState || !currentState) return null;
    return null;
    try {
        // Animate tiles in markets
        currentState.markets.forEach((market, marketIndex) => {
            market.forEach((tile, tileIndex) => {
                const tileElement = document.getElementById(`market-${marketIndex}-tile-${tileIndex}`);
                if (tileElement) {
                    // Temporarily add transition class
                    tileElement.classList.add("transition-opacity");
                    tileElement.style.opacity = "0";
                    tileElement.style.backgroundImage = getBGImage(tile);

                    const transitionEndHandler = () => {
                        tileElement.style.opacity = "1";
                        tileElement.removeEventListener("transitionend", transitionEndHandler);

                        // Remove transition class after transition ends
                        setTimeout(() => {
                            tileElement.classList.remove("transition-opacity");
                        }, 500); // 500ms is the duration of the transition
                    };

                    tileElement.addEventListener("transitionend", transitionEndHandler);
                }
            });
        });

        // Animate white tile in sharedMarket
        const sharedMarketTile = document.getElementById("market--1-tile-0");
        if (sharedMarketTile) {
            // Temporarily add transition class
            sharedMarketTile.classList.add("transition-opacity");

            const sharedMarketTransitionEndHandler = () => {
                sharedMarketTile.style.opacity = "1";
                sharedMarketTile.removeEventListener("transitionend", sharedMarketTransitionEndHandler);

                // Remove transition class after transition ends
                setTimeout(() => {
                    sharedMarketTile.classList.remove("transition-opacity");
                }, 500); // 500ms is the duration of the transition
            };

            sharedMarketTile.addEventListener("transitionend", sharedMarketTransitionEndHandler);
        }
    } catch (error) {
        console.log("Error in animateNewRound: ", error);
    }
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

                //trigger next animation
                //setAnimationQueue(animationQueue.slice(1));
            };
        }
    } catch (error) {
        console.error(error);
    }
};


export const animatePlayerLeft = (previousState, currentState) => {
    try {
        if (!previousState || !currentState) return null;
        console.log("AnimatePlayerLeft", previousState, currentState);

        // Find the player who left
        const leftPlayer = previousState.players.find(player => !currentState.players.includes(player));
        if(!leftPlayer || leftPlayer === 'undefined') return null;
        console.log("LeftPlayerID", leftPlayer);
        // Find the player board of the left player
        const leftPlayerBoard = previousState.playerBoards.find(playerBoard => playerBoard.playerId._id === leftPlayer);
        if(!leftPlayerBoard || leftPlayerBoard === 'undefined') return null;
        console.log("LeftPlayerBoard", leftPlayerBoard);
        
         // Apply styling to indicate the inactive player
         const leftPlayerBoardId = `playerBoard-${leftPlayerBoard._id}`;
         const leftPlayerBoardElement = document.getElementById(leftPlayerBoardId);
         console.log("LeftPlayerBoardElement", leftPlayerBoardElement);
        
         if (leftPlayerBoardElement) {
             leftPlayerBoardElement.classList.add('desaturate');
         }
        console.log("AFTER LEFT PLAYER");
    } catch (error) {
        console.error(error);
    }
};


// Define the expected structure of a game state (example using JavaScript objects)
const expectedGameStateStructure = {
    _id: 'string',
    playerToMove: 'string',
    markets: 'array',
    sharedMarket: 'array',
    playerBoards: 'array',
    players: 'array',
    gameStatus: 'string',
    roomId: 'string',
};

// Function to validate the game state
const validateGameState = (state) => {
    if (typeof state !== 'object' || state === null) return false;

    for (let key in expectedGameStateStructure) {
        if (!(key in state)) return false;
        if (typeof state[key] !== expectedGameStateStructure[key]) return false;
    }

    // Further validate nested structures
    if (!Array.isArray(state.markets) || !Array.isArray(state.sharedMarket) || !Array.isArray(state.playerBoards)) return false;

    if(state.playerToMove === null) return false;
    if(state.players.length < 2) return false;
    if(state.players.length > 4) return false;
    if(state.markets.length !== state.playerBoards.length) return false;

    //checks for playerBoards
    for (let board of state.playerBoards) {
        if (typeof board !== 'object' || !('_id' in board) || !('collectedTiles' in board) || !('floorTiles' in board) || !('wallTiles' in board)) {
            return false;
        }
    }

    return true;
};