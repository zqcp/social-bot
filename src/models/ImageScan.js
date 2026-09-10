const {
    Schema,
    model
} = require("mongoose");

// =========================
// IMAGE SCAN MODEL
// =========================

const imageScanSchema =
    new Schema({

        guildId: {
            type: String,
            required: true,
            unique: true
        },

        enabled: {
            type: Boolean,
            default: false
        }

    });

module.exports =
    model(
        "ImageScan",
        imageScanSchema
    );
