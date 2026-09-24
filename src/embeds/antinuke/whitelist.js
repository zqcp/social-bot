const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // WHITELIST
    // =========================

    added(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${member} is now **whitelisted** and will not trigger AntiNuke.`
            );
    },

    removed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${member} has been removed from the **whitelist**.`
            );
    },

    alreadyExists(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: ${member} is already **whitelisted**.`
            );
    },

    notFound(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: ${member} is not **whitelisted**.`
            );
    },

    list(user, members) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **AntiNuke whitelist:**\n${members || "None"}`
            );
    },

    invalid(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Invalid **user**.`
            );
    },

    botsEnabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **Bot whitelisting** has been enabled.`
            );
    },

    botsDisabled(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **Bot whitelisting** has been disabled.`
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
