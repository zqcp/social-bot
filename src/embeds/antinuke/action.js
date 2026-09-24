const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // ACTIONS
    // =========================

    punished(user, member, action, module) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${action}** has been applied to ${member} for triggering the **${module}** antinuke module.`
            );
    },

    logged(user, member, action, module) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: ${member} triggered the **${module}** antinuke module. Action: **${action}**.`
            );
    },

    ignored(user, member, module) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: ${member} was **ignored** by the **${module}** antinuke module.`
            );
    },

    failed(user, action, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **${action}** ${member}. Please try again.`
            );
    }

};
