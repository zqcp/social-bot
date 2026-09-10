const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

// =========================
// IMAGE SCAN EMBEDS
// =========================

module.exports = {

    // =========================
    // SETUP
    // =========================

    setup(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: **Image Moderation Setup**\n\n` +
                `Would you like to enable image and video moderation?`
            );

    },

    // =========================
    // ALREADY ENABLED
    // =========================

    alreadyEnabled(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Image and video moderation is already **enabled**.`
            );

    },

    // =========================
    // SETUP SUCCESS
    // =========================

    setupSuccess(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Image and video moderation has been **enabled**.`
            );

    },

    // =========================
    // DISABLE
    // =========================

    disable(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: **Disable Image Moderation**\n\n` +
                `Would you like to disable image and video moderation?`
            );

    },

    // =========================
    // ALREADY DISABLED
    // =========================

    alreadyDisabled(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Image and video moderation is already **disabled**.`
            );

    },

    // =========================
    // DISABLE SUCCESS
    // =========================

    disableSuccess(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Image and video moderation has been **disabled**.`
            );

    }

};
