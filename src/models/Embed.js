const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            default: ""
        },

        emoji: {
            type: String,
            default: ""
        },

        style: {
            type: String,
            default: "secondary"
        },

        customId: {
            type: String,
            default: ""
        },

        url: {
            type: String,
            default: ""
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
);

const selectMenuSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: "string"
        },

        customId: {
            type: String,
            default: ""
        },

        placeholder: {
            type: String,
            default: ""
        },

        minValues: {
            type: Number,
            default: 1
        },

        maxValues: {
            type: Number,
            default: 1
        },

        disabled: {
            type: Boolean,
            default: false
        },

        options: {
            type: Array,
            default: []
        }
    },
    { _id: false }
);

const embedSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        channelId: {
            type: String,
            default: null
        },

        content: {
            type: String,
            default: ""
        },

        embeds: {
            type: Array,
            default: []
        },

        buttons: {
            type: [buttonSchema],
            default: []
        },

        selectMenus: {
            type: [selectMenuSchema],
            default: []
        },

        createdBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

embedSchema.index(
    { guildId: 1, name: 1 },
    { unique: true }
);

module.exports =
    mongoose.models.Embed ||
    mongoose.model("Embed", embedSchema);
