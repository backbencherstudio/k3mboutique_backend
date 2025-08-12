const mongoose = require("mongoose");
const { Schema } = mongoose;

const WalletSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        balance: { type: Number, default: 0 },
    }
);

module.exports = mongoose.model("Wallet", WalletSchema);
