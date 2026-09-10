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
                `${config.emojis.success} ${user}: Image moderation has been **enabled**.`
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
                `${config.emojis.error} ${user}: Image moderation is already **enabled**.`
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
                `${config.emojis.error} ${user}: Image moderation has been **disabled**.`
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
                `${config.emojis.error} ${user}: Image moderation is already **disabled**.`
            );

    }

};
