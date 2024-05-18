import  PlayerBoard  from "../models/game/playerBoardModel.js"
import  Game  from "../models/game/gameModel.js"
import  Room  from "../models/roomModel.js"
import {io, getReceiverSocketId} from "../socket/socket.js"
import { indexForColorAtRow, wallTileAtIndexes } from "../utils/wallTilesPattern.js"
import User from "../models/userModel.js"

const newBag = async () => {
    const colors = ['blue', 'red', 'yellow', 'azure', 'black'];
    const tilesPerColor = 20; 
    const bag = [];

    for (const color of colors) {
        for (let i = 0; i < tilesPerColor; i++) {
            bag.push(color);
        }
    }
    return bag;
};

const newMarkets = (num) => {
    const markets = [];
    for (let i = 0; i < num; i++) {
        markets.push(['empty', 'empty', 'empty', 'empty']);
    }
    return markets;
};

const newPlayerBoards = async (room) => {
    const boards = [];
    for (const userId of room.users) {
        const board = await PlayerBoard.create({ playerId: userId });
        boards.push(board._id);
    }
    return boards;
};

const getRandomTileFromBag = async (bag) => {
    const randomIndex = Math.floor(Math.random() * bag.length);
    const tile = bag[randomIndex];
    bag.splice(randomIndex, 1); // remove the tile from the bag

    return tile;
  }
  
const loadMarkets = async (game) => {
    for (let market of game.markets) {
      for (let i = 0; i < market.length; i++) {
        if (market[i] === "empty" && game.bag.length > 0) {
          market[i] = await getRandomTileFromBag(game.bag);
        }
      }
    }
}

//creating a game 
export const setupGame = async (req, res) => {
    // if (!req.user.roomId) { //kozos ready-zes utan indul csak
    //     return res.status(400).json({ error: "User is not in a room" });
    // }
    console.log("setupGame")
    console.log("req.userID: ", req.user._id)
    try {
        const room = await Room.findOne({ _id: req.user.roomId });
        if (!room) {
            return res.status(404).json({ error: "No such room" });
        }
        // if(room.owner.toString() !== req.user._id.toString()){
        //     return res.status(400).json({error: "Only the owner can start the game"});
        // }

        let newGame = await Game.findOne({ roomId: room._id });
        if (newGame) {
            const populatedGame = await newGame.populate({
                path: 'playerBoards',
                populate: {
                  path: 'playerId',
                  model: 'User' 
                }
              });
            for (const userId of room.users) {
                const receiverSocketId = getReceiverSocketId(userId);
                io.to(receiverSocketId).emit("NewGame",  populatedGame );
            }
            return console.log("Game already exists");
        }

        const bag = await newBag();
        const markets = newMarkets(room.users.length + 3);
        const sharedMarket = ['white'];
        const playerBoards = await newPlayerBoards(room);

        newGame = await Game.create({
            roomId: room._id,
            players: room.users,
            playerToMove: room.users[0],
            bag,
            markets,
            sharedMarket,
            playerBoards,
            gameStatus: 'playing'
        });
        room.gameId = newGame._id;
        await room.save();
        io.emit("updateRoom", room);

        const populatedGame = await newGame.populate({
            path: 'playerBoards',
            populate: {
              path: 'playerId',
              model: 'User' 
            }
          });
        for (const userId of room.users) {
            const receiverSocketId = getReceiverSocketId(userId);
            io.to(receiverSocketId).emit("NewGame",  populatedGame );
        }

        res.status(200).json(newGame);
        startNewRound(newGame);
    } catch (error) {
        console.log("Error in setupGame: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const startGame = async (req, res) => {
    // try {
    //     const game = await Game.findOne({ roomId: req.user.roomId });
    //     console.log("game: ", game._id);
    //     if (!game) {
    //         return res.status(404).json({ error: "No such game" });
    //     }

    //     game.gameStatus = 'playing';
    //     await startNewRound(game);
    //     console.log("startNewRound done")
    //     await game.save();

    //     return res.status(200).json({ message: "Game started successfully" });
    // } catch (error) {
    //     console.log("Error in startGame: ", error.message);
    //     res.status(500).json({ error: "Internal server error" });
    // }
};

const startNewRound = async (game) => {
    try {
        console.log("startNewRound")
        if (!game) {
            throw new Error("No game found");
        }
        if(game.markets.length === game.players.length + 3){
            game.markets = newMarkets(game.players.length + 3);
        }
        
        await loadMarkets(game);
        game.sharedMarket = ['white'];

        await game.save();
        
        const populatedGame = await Game.findById(game._id).populate({
            path: 'playerBoards',
            populate: {
              path: 'playerId',
              model: 'User' 
            }
          });
        
        for (const userId of game.players) {
            console.log("StartNewRound userId: ", userId)
            const receiverSocketId = getReceiverSocketId(userId);
            io.to(receiverSocketId).emit("UpdateGame", populatedGame );
        }

    } catch (error) {
        console.log("Error in startNewRound: ", error.message);
    }
}

const calculatePoints = (wallTiles, rowIndex, colIndex) => {
    let points = 0;
    let inARow = false;
    let inACol = false;
    // Count points in the column upwards
    for (let row = rowIndex - 1; row >= 0; row--) {
      if (wallTiles[row][colIndex] === 'empty') {
        break;
      }
      points++;
      inACol = true;
    }
  
    // Count points in the column downwards
    for (let row = rowIndex + 1; row < wallTiles.length; row++) {
      if (wallTiles[row][colIndex] === 'empty') {
        break;
      }
      points++;
      inACol = true;
    }
  
    // Count points in the row to the left
    for (let col = colIndex - 1; col >= 0; col--) {
      if (wallTiles[rowIndex][col] === 'empty') {
        break;
      }
      points++;
      inARow = true;
    }
  
    // Count points in the row to the right
    for (let col = colIndex + 1; col < wallTiles[rowIndex].length; col++) {
      if (wallTiles[rowIndex][col] === 'empty') {
        break;
      }
      points++;
      inARow = true;
    }
  
    // // If the tile is not touching any other tile, count it as 1 point
    // if (points === 0) {
    //   points = 1;
    // }
    if(!inARow && !inACol){//the tile is by itself
        points = 1;
    }
    //if tile is in a row or col -> +1 point; if both -> +2 point
    if(inARow){ 
        points++;
    }
    if(inACol){
        points++;
    }

      // Check if the last placed tile completes a row
      let rowCompleted = true;
      for (let col = 0; col < wallTiles[rowIndex].length; col++) {
          if (wallTiles[rowIndex][col] === 'empty') {
              rowCompleted = false;
              break;
          }
      }
      if (rowCompleted) {
          points += 2;
      }
      // Check if the last placed tile completes a column
      let colCompleted = true;
      for (let row = 0; row < wallTiles.length; row++) {
          if (wallTiles[row][colIndex] === 'empty') {
          colCompleted = false;
          break;
          }
      }
      if (colCompleted) {
          points += 7;
      }
      const lastPlacedTile = wallTiles[rowIndex][colIndex];
      let allRowsHaveTile = true;
      for (let row = 0; row < wallTiles.length; row++) {
          if (!wallTiles[row].includes(lastPlacedTile)) {
          allRowsHaveTile = false;
          break;
          }
      }
      if (allRowsHaveTile) {
          points += 10;
      }
  
    return points;
  };

const isGameOver = (game) => {
    for (const playerBoard of game.playerBoards) {
        for (let row = 0; row < playerBoard.wallTiles.length; row++) {
            if (playerBoard.wallTiles[row].includes('empty')) {
                continue;
            }
            else {
                return true;
            }
        }
    }
    return false;
};

const onRoundOver = async (game) => {
    try {
        //game is already populated by playerBoards
        //game = game.populate('playerBoards');

        for(let playerBoard of game.playerBoards){
            //playerBoard =
            for(let row = 0; row < playerBoard.collectedTiles.length; ++row){
                //collectedTiles[row] is full -> move single tile to wall
                if(playerBoard.collectedTiles[row].every(tile => tile !== 'empty')){
                    const tile = playerBoard.collectedTiles[row][0];
                    playerBoard.wallTiles[row][indexForColorAtRow(tile, row)] = tile;
                    
                    //place remainder of collectedTiles[row] in bag
                    for (let i = 1; i < playerBoard.collectedTiles[row].length; i++) {
                        game.bag.push(playerBoard.collectedTiles[row][i]);
                    }
                    playerBoard.collectedTiles[row] = Array(row + 1).fill('empty');

                    //Calculate points
                    console.log("calculatePoints: ", calculatePoints(playerBoard.wallTiles, row, indexForColorAtRow(tile, row)));
                    playerBoard.points += calculatePoints(playerBoard.wallTiles, row, indexForColorAtRow(tile, row));

                    //check for game over (a wall row is full)
                    if(playerBoard.wallTiles[row].every(tile => tile !== 'empty')){
                        game.gameStatus = "ended";
                    }
                }
            }
            if (playerBoard.floorTiles.includes('white')) {
                game.playerToMove = playerBoard.playerId;
            }
            //Calculate points for floorTiles and clear floorTiles
            const floorTilesCount = playerBoard.floorTiles.filter(tile => tile !== 'empty').length;
            
            let minusPoints = 0;
            switch (floorTilesCount) {
                case 1:
                    minusPoints = 1;
                    break;
                case 2:
                    minusPoints = 2;
                    break;
                case 3:
                    minusPoints = 4;
                    break;
                case 4:
                    minusPoints = 6;
                    break;
                case 5:
                    minusPoints = 8;
                    break;
                case 6:
                    minusPoints = 11;
                    break;
                case 7:
                    minusPoints = 14;
                    break;
                default:
                    break;
            }
            console.log("minusPoints: ", minusPoints);
            playerBoard.points -= minusPoints;

            //not white floortiles back to bag
            playerBoard.floorTiles = playerBoard.floorTiles.map(tile => {
                if (tile !== 'white' && tile !== 'empty') {
                    game.bag.push(tile);
                }
            });
            playerBoard.floorTiles = Array(7).fill('empty');
            //if gameover do smthg

            //save playerBoard
            await playerBoard.save();
        }
    
        //white back to shared market
        game.sharedMarket.push('white');

        //socketelni kell
        //temp megoldas
        game.status = "ended";
        await game.save();

        const populatedGame = await Game.findById(game._id)
        .populate({
            path: 'playerBoards',
            populate: {
                path: 'playerId',
                model: 'User' 
            }
        });

        if(isGameOver(game)){
            console.log("Game is over");
            //if(true){
            for (const userId of game.players) {
                const receiverSocketId = getReceiverSocketId(userId);
                io.to(receiverSocketId).emit("GameOver",  populatedGame );
            }
            return;
        }
        for (const userId of game.players) {
            const receiverSocketId = getReceiverSocketId(userId);
            io.to(receiverSocketId).emit("UpdateGame",  populatedGame );
        }
        //temp vege
        //await game.save();

        //next round
        await startNewRound(game);
    } catch (error) {
        console.log("Error in gameController, onRoundOver: ", error.message);
    }
}

//export const isGameOver = async (req, res) => {};

const isRoundOver = (game) => {
    for (const market of game.markets) {
        for (const tile of market) {
            if (tile !== "empty") {
                return false;
            }
        }
    }
    for (const tile of game.sharedMarket) {
        if (tile !== "empty") {
            return false;
        }
    }
    return true;
};

const isValideMove = (playerBoard, color, rowInd) => {
    //can place tiles anytime on the floor
    if(rowInd === -1){
        return true;
    }
    //check if coressponding wallTile is empty
    if(playerBoard.wallTiles[rowInd][indexForColorAtRow(color,rowInd)] !== 'empty'){
        return false;
    }
    //check if collectedTiles[row] is empty or contains only color
    for (const tile of playerBoard.collectedTiles[rowInd]) {
        if (tile !== 'empty' && tile !== color) {
            return false;
        }
    }
    //otherwise
    return true;
}

export const takeTiles = async (req, res) => {
    try {
        const game = await Game.findOne({ roomId: req.user.roomId }).populate('playerBoards');
        if(!game){
            return res.status(404).json({error: "No such game"});
        }

        const playerBoard = game.playerBoards.find(board => board.playerId.toString() === req.user._id.toString());
        if (!playerBoard) {
            return res.status(404).json({ error: "PlayerBoard not found" });
        }

        const { tile: color, marketId: source, row } = req.body;
        console.log("color: ", color, "source: ", source, "row: ", row);

        //a jatekos kovetkeyik
        if(!game.playerToMove.equals(req.user._id)){
            return res.status(400).json({error: "Not your turn"});
        }

        //Van tabla szin sor, ellenorzunk
        if(!isValideMove(playerBoard, color, row)){
            return res.status(400).json({error: "Invalid move"});
            //socket Error kell vagz invalid move

        }//ha nem valid a lepes nem csinalunk semmit

        let tilesToTake = [];
        if(source >= 0){
            game.markets[source].forEach((tile, tileIndex) => {
                if(tile === color){
                    tilesToTake.push(tile);
                    game.markets[source][tileIndex] = "empty";
                }
            });
            game.sharedMarket = [...game.sharedMarket, ...game.markets[source].filter(tile => tile !== "empty")];
            game.markets[source] = ["empty", "empty", "empty", "empty"];
        }else if(source === -1){
            game.sharedMarket = game.sharedMarket.filter((tile, index) => {
                if (tile === color) {
                    tilesToTake.push(tile);
                    return false;
                }
                return true;
            });
            if (game.sharedMarket.includes('white')) {
                game.sharedMarket = game.sharedMarket.filter(tile => tile !== 'white');
                
                const emptyIndex = playerBoard.floorTiles.findIndex(tile => tile === 'empty');
                if (emptyIndex !== -1) {
                    playerBoard.floorTiles[emptyIndex] = 'white';
                }
            }
        }

        if(row === -1){
            for (let i = 0; i < tilesToTake.length; i++) {
                const emptyIndex = playerBoard.floorTiles.findIndex(tile => tile === 'empty');
                if (emptyIndex !== -1) {
                    playerBoard.floorTiles[emptyIndex] = tilesToTake[i];
                }
            }
        }else{
            // Fill collectedTiles[row] with tilesToTake
            for (let i = 0; i < tilesToTake.length; i++) {
                if (playerBoard.collectedTiles[row].includes('empty')) {
                    const emptyIndex = playerBoard.collectedTiles[row].indexOf('empty');
                    playerBoard.collectedTiles[row][emptyIndex] = tilesToTake[i];
                } else {
                    const emptyIndex = playerBoard.floorTiles.findIndex(tile => tile === 'empty');
                    if (emptyIndex !== -1) {
                        playerBoard.floorTiles[emptyIndex] = tilesToTake[i];
                    }
                }
            }
        }

        //check if round is over
        if (isRoundOver(game)) {
            console.log("Round is over");
            await onRoundOver(game);
        } else {
            game.playerToMove = game.players[(game.players.indexOf(req.user.id) + 1) % game.players.length];
        }
        
        await game.save();
        await playerBoard.save();

        const populatedGame = await Game.findById(game._id).populate({
            path: 'playerBoards',
            populate: {
              path: 'playerId',
              model: 'User' 
            }
          });

        //socket
        for (const userId of game.players) {
            const receiverSocketId = getReceiverSocketId(userId);
            io.to(receiverSocketId).emit("UpdateGame",  populatedGame );
        }
        res.status(200).json({ message: "Tiles taken successfully" });
        
        
        
    } catch (error) {
        console.log("Error in takeTiles: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Send back the game
export const getGame = async (req, res) => {
    try {
        console.log("getGame")
        const roomId = req.params.id;
        console.log("roomId: ", req.params);
        console.log("roomId: ", roomId);
        const game = await Game.findOne({ roomId: roomId }).populate('playerBoards');

        if (!game) {
            const receiverSocketId = getReceiverSocketId(req.user._id);
            io.to(receiverSocketId).emit("GetGame", null );
            io.to(receiverSocketId).emit("UpdateGame", null );
            
            return //res.status(404).json({ error: "No such game" });
        }
        if(game.roomId !== roomId){
            return //ha veletlen a user benne maradt volna egy jatekba
        }


        const populatedGame = await Game.findById(game._id).populate({
            path: 'playerBoards',
            populate: {
              path: 'playerId',
              model: 'User' 
            }
          });
        for (const userId of game.players) {
            const receiverSocketId = getReceiverSocketId(userId);
            io.to(receiverSocketId).emit("GetGame", populatedGame );
            io.to(receiverSocketId).emit("UpdateGame", populatedGame );
        }

        res.status(200).json(game);
    } catch (error) {
        console.log("Error in getGame: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const leaveCurrentGame = async (userId) => {
    try {
        //find game user is in
        const game = await Game.findOne({ players: userId }).populate('playerBoards');
        if(!game){
            return;
        }

        //find playerBoard, delete it and remove it from game
        const playerBoard = await PlayerBoard.findOneAndDelete({ playerId: userId });
        if(!playerBoard){ return; }
        const index = game.playerBoards.findIndex(board => board.playerId.toString() === userId.toString());
        if (index > -1) {
            console.log("playerBoard deleted");
            game.playerBoards.splice(index, 1);
        }

        //remove player from game, also change playerToMove if needed
        if(game.playerToMove.toString() === userId.toString()){
            game.playerToMove = game.players[(game.players.indexOf(userId) + 1) % game.players.length];
        }
        game.players = game.players.filter(player => player.toString() !== userId.toString());
        

        await game.save();

        const populatedGame = await game.populate({
            path: 'playerBoards',
            populate: {
              path: 'playerId',
              model: 'User' 
            }
          });
          console.log("populatedGame: ", populatedGame);

        if(game.players.length > 1){
            for (const _userId of game.players) {
                const receiverSocketId = getReceiverSocketId(_userId);
                io.to(receiverSocketId).emit("UpdateGame",  populatedGame );
            }
        }
        else{
            game.gameStatus = "ended";
            for (const _userId of game.players) {
                const receiverSocketId = getReceiverSocketId(_userId);
                io.to(receiverSocketId).emit("GameOver",  populatedGame );
            }
        }
    }
    catch (error) {
        console.log("Error in leaveGame: ", error.message);
    }
}

//deleting the game by id? or by user.roomId?
export const deleteGame = async (gameId) => {
    try {
        const game = await Game.findOne({ _id: gameId });

        if (!game) {
            return 
        }

        game.players.forEach(player => {
            User.findById(player).then(user => {
                user.roomId = null;
                user.save();
            });
        });

        await Game.findOneAndDelete({ _id: gameId });


    } catch (error) {
        console.log("Error in deleteGame: ", error.message);
    }
}

