const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // MODULE
    // =========================

    enabled(
        user,
        module,
        punishment,
        threshold,
        detection
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Enabled **${module}** antinuke module.\n` +
                `Punishment is set to **${punishment}**, threshold is set to **${threshold}** and command detection is **${detection}**.`
            );
    },

    disabled(user, module) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Disabled **${module}** antinuke module.`
            );
    },

    status(
        user,
        module,
        status,
        punishment,
        threshold,
        detection
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: **${module}** antinuke module is **${status}**.\n` +
                `Punishment is set to **${punishment}**, threshold is set to **${threshold}** and command detection is **${detection}**.`
            );
    },

    invalid(user, module) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${module}\` is not a valid antinuke module.`
            );
    },

    usage(user, module) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Missing **status**. Use \`,antinuke ${module} <on|off>\`.`
            );
    },

    threshold(user, threshold) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${threshold}\` is an invalid **threshold**.`
            );
    },

    punishment(user, punishment) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${punishment}\` is an invalid **punishment**.`
            );
    }

};
