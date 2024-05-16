import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    roomId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Room',
        required: true
    },
    players:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User',
    },
    playerToMove:{
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : null
    },
    bag : {
        type: [String],
        enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
        default : []
    },
    markets: {
        type: [[String]],
        enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
        default: []
    },
    sharedMarket:{
        type: [String],
        enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
        default: ['white']
    },
    playerBoards:{
        type : [mongoose.Schema.Types.ObjectId],
        ref: 'PlayerBoard',
        default: []
    },
    gameStatus:{
        type: String,
        enum: ['waiting', 'started', 'playing', 'ended'],
        default: 'waiting'
    }
});

const Game = mongoose.model('Game', gameSchema);
export default Game;