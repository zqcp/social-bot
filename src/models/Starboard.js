const {
    Schema,
    model
} = require("mongoose");

const starboardSchema =
    new Schema(
        {

            guildId: {
                type: String,
                required: true
            },

            channelId: {
                type: String,
                required: true
            },

            emoji: {
                type: String,
                required: true
            },

            color: {
                type: Schema.Types.Mixed,
                required: true
            },

            threshold: {
                type: Number,
                required: true,
                min: 1
            },

            selfReact: {
                type: Boolean,
                required: true,
                default: false
            }

        },
        {
            timestamps: true
        }
    );

starboardSchema.index(
    {
        guildId: 1,
        channelId: 1
    },
    {
        unique: true
    }
);

module.exports =
    model(
        "Starboard",
        starboardSchema
    );
