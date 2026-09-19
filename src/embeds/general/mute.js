const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    muted(user, member, duration, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **muted** **${member.username}** for \`${duration}\` for \`${reason || "No reason provided"}\`.`
            );
    },

    unmuted(member) {
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
                `**${member.username}** is now unmuted.`
            );
    },

    alreadyMuted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${member.username}** is already muted.`
            );
    },

    alreadyUnmuted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${member.username}** is already unmuted.`
            );
    },

    muteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **mute** **${member.username}**. Please try again.`
            );
    },

    unmuteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **unmute** **${member.username}**. Please try again.`
            );
    },

    setupMissing(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Missing **mute role**.`
            );
    },

    removeMissing(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Missing **mute role**.`
            );
    },

    setup(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **mute role** has been set to ${role}.`
            );
    },

    alreadySetup(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **mute role** is already set to ${role}.`
            );
    },

    notSetup(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **mute role** hasn't been setup.`
            );
    },

    removed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **mute role** has been removed.`
            );
    },

    setupFailed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **set the mute role**. Please try again.`
            );
    },

    removeFailed(user) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **remove the mute role**. Please try again.`
            );
    }

};
