import mongoose from "mongoose";

const playerBoardSchema = new mongoose.Schema({
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    collectedTiles: {
      type: [[String]],
      enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
      default: [
        ['empty'],
        ['empty', 'empty'],
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty']
      ]
    },
    wallTiles: {
      type: [[String]], // Represents a 5x5 grid of tiles
      enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
      default:[
        ['empty','empty','empty','empty','empty'],
        ['empty','empty','empty','empty','empty'],
        ['empty','empty','empty','empty','empty'],
        ['empty','empty','empty','empty','empty'],
        ['empty','empty','empty','empty','empty']
      ]
    },
    floorTiles:{
      type: [String], 
      enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
      default:[ 'empty','empty','empty','empty','empty','empty','empty'],
    }
  });

const PlayerBoard = mongoose.model('PlayerBoard', playerBoardSchema);
export default PlayerBoard;