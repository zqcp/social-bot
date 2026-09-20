const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // FILTER
    // =========================

    added(user, word) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Added \`${word}\` to the filter.`
            );
    },

    removed(user, word) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Removed \`${word}\` from the filter.`
            );
    },

    alreadyBlocked(user, word) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${word}\` is already blocked.`
            );
    },

    notBlocked(user, word) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${word}\` isn't blocked.`
            );
    },

    enabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Filter has been **enabled**.`
            );
    },

    alreadyEnabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Filter is already **enabled**.`
            );
    },

    disabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Filter has been **disabled**.`
            );
    },

    alreadyDisabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Filter is already **disabled**.`
            );
    },

    cleared(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Filter has been **cleared**.`
            );
    },

    alreadyCleared(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Filter is already **cleared**.`
            );
    },

    empty(user) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: No blocked words are configured.`
            );
    },

    disabledStatus(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: The filter is currently **disabled**.`
            );
    }

};
