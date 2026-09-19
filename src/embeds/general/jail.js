const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    jailed(user, member, duration, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **jailed** **${member.username}**${duration ? ` for \`${duration}\`` : ""}${reason ? ` for \`${reason}\`` : ""}.`
            );
    },

    unjailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **unjail** **${member.username}**.`
            );
    },

    alreadyJailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${member.username}** is already jailed.`
            );
    },

    alreadyUnjailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${member.username}** is already unjailed.`
            );
    },

    setup(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **Jail system** has been setup with ${role}.`
            );
    },

    alreadySetup(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **Jail system** is already setup.`
            );
    },

    notSetup(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **Jail system** hasn't been setup.`
            );
    },

    removed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **Jail system** has been removed.`
            );
    },

    setupFailed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **setup the jail system**. Please try again.`
            );
    },

    removeFailed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **remove the jail system**. Please try again.`
            );
    },

    jailFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **jail** **${member.username}**. Please try again.`
            );
    },

    unjailFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **unjail** **${member.username}**. Please try again.`
            );
    }

};
