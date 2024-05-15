import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
    tiles:{
        type: [String],
        enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
        default: ['empty','empty','empty','empty']
    }
});

const Market = mongoose.model('Market', marketSchema);
export default Market;