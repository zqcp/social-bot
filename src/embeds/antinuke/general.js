const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // ANTIRAID
    // =========================

    enabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiRaid has been **enabled**.`
            );
    },

    alreadyEnabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: AntiRaid is already **enabled**.`
            );
    },

    disabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiRaid has been **disabled**.`
            );
    },

    alreadyDisabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: AntiRaid is already **disabled**.`
            );
    },

    notConfigured(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: AntiRaid hasn't been **configured**.`
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
