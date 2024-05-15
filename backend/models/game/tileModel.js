import mongoose from "mongoose";

const tileSchema = new mongoose.Schema({
  color: {
    type: String,
    enum: ['red', 'black', 'blue', 'azure', 'yellow', 'empty', 'white'],
    required: true
  },
  status: {
    type: String,
    enum: ['bag', 'board', 'market'],
    default: 'bag'
  }
});

const Tile = mongoose.model("Tile", userSchema)
export default Tile