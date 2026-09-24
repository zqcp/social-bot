const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // ADMIN
    // =========================

    added(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${member} is now an **AntiNuke admin** and can edit AntiNuke settings.`
            );
    },

    removed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${member} is no longer an **AntiNuke admin**.`
            );
    },

    alreadyAdded(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: ${member} is already an **AntiNuke admin**.`
            );
    },

    notFound(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: ${member} is not an **AntiNuke admin**.`
            );
    },

    list(user, admins) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **AntiNuke admins:**\n${admins || "None"}`
            );
    },

    invalid(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Invalid **user**.`
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
