const { Schema } = require("mongoose");

// 9348a2e7f3e118a8387a5a21bff8a48b
const positionSchema = new Schema({
  positionId: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  purchaseQty: {
    type: Number,
    required: true,
  },
});

module.exports = positionSchema;
