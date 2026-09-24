const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // CONFIGURATION
    // =========================

    updated(user, setting, value) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${setting}** has been set to **${value}**.`
            );
    },

    invalid(user, setting, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${value}\` is an invalid **${setting}**.`
            );
    },

    missing(user, setting) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Missing **${setting}**.`
            );
    },

    overview(user, description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **AntiNuke configuration:**\n${description}`
            );
    },

    failed(user, action) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **${action}**. Please try again.`
            );
    }

};
