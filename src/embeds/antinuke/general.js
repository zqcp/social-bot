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

    status(user, status) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: AntiRaid is currently **${status}**.`
            );
    },

    reset(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiRaid configuration has been **reset**.`
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
