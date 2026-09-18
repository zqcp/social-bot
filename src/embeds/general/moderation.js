const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    banned(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **banned** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    unbanned(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **unbanned** **${member.username}**.`
            );
    },

    hardbanned(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **hardbanned** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    unhardbanned(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **unhardbanned** **${member.username}**.`
            );
    },

    kicked(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **kicked** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    accepted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **accepted** **${member.username}**.`
            );
    },

    timedOut(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **timed out** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    timeoutRemoved(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **removed timeout** from **${member.username}**.`
            );
    },

    muted(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **muted** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    unmuted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **unmuted** **${member.username}**.`
            );
    },

    imageMuted(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **image muted** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    imageUnmuted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **image unmuted** **${member.username}**.`
            );
    },

    reactionMuted(user, member, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **reaction muted** **${member.username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    reactionUnmuted(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **reaction unmuted** **${member.username}**.`
            );
    },

    stripped(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **stripped** **${member.username}** of their removable roles.`
            );
    },

    banFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **ban** **${member.username}**. Please try again.`
            );
    },

    unbanFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **unban** **${member.username}**. Please try again.`
            );
    },

    hardbanFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **hardban** **${member.username}**. Please try again.`
            );
    },

    unhardbanFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **unhardban** **${member.username}**. Please try again.`
            );
    },

    kickFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **kick** **${member.username}**. Please try again.`
            );
    },

    acceptFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **accept** **${member.username}**. Please try again.`
            );
    },

    timeoutFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **timeout** **${member.username}**. Please try again.`
            );
    },

    untimeoutFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **remove timeout** from **${member.username}**. Please try again.`
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

    imageMuteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **image mute** **${member.username}**. Please try again.`
            );
    },

    imageUnmuteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **image unmute** **${member.username}**. Please try again.`
            );
    },

    reactionMuteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **reaction mute** **${member.username}**. Please try again.`
            );
    },

    reactionUnmuteFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **reaction unmute** **${member.username}**. Please try again.`
            );
    },

    stripFailed(user, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **strip** **${member.username}**. Please try again.`
            );
    }

};
