const mongoose = require("mongoose");

const MuteSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true
        },

        muteRoleId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Mute ||
    mongoose.model("Mute", MuteSchema);
