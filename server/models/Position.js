const { Schema } = require("mongoose");

// 9348a2e7f3e118a8387a5a21bff8a48b
const positionSchema = new Schema({
  purchaseDate: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  purchaseQty: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

module.exports = positionSchema;
