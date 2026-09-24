const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // LOGS
    // =========================

    set(user, channel) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logs have been set to ${channel}.`
            );
    },

    removed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logs have been **removed**.`
            );
    },

    invalid(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Invalid **channel**.`
            );
    },

    failed(user, action) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **${action}**. Please try again.`
            );
    },

    enabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logging has been **enabled**.`
            );
    },

    disabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logging has been **disabled**.`
            );
    },

    active(user, channel) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: AntiNuke logs are currently **active** in ${channel}.`
            );
    },

    unlocked(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logging has been **unlocked**.`
            );
    },

    reset(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: AntiNuke logging configuration has been **reset**.`
            );
    },

    result(user, description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: ${description}`
            );
    },

    stats(user, description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **AntiNuke log statistics:**\n${description}`
            );
    },

    list(user, logs) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **AntiNuke logs:**\n${logs || "None"}`
            );
    }

};
