const {
    Schema,
    model
} = require("mongoose");

// =========================
// FILTER SCHEMA
// =========================

const filterSchema =
    new Schema(
        {
            guildId: {
                type: String,
                required: true,
                unique: true
            },

            enabled: {
                type: Boolean,
                default: false
            },

            premade: {
                type: Boolean,
                default: false
            },

            disabledPremade: {
                type: [
                    String
                ],
                default: []
            },

            words: {
                type: [
                    String
                ],
                default: []
            }
        },
        {
            timestamps: true
        }
    );

// =========================
// MODEL
// =========================

module.exports =
    model(
        "Filter",
        filterSchema
    );
