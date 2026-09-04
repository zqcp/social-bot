const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {

    success(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${description}`
            );
    },

    failed(description) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${description}`
            );
    },

    error(description) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${description}`
            );
    },

    regular(description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    }

};
