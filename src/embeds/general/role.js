const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {

    // =========================
    // ERRORS
    // =========================

    memberNotFound(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find that member.`
            );
    },

    noRole(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Please provide a role.`
            );
    },

    roleNotFound(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find the role \`${role}\`.`
            );
    },

    botRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I can't manage \`${role}\` because it's above my highest role.`
            );
    },

    userRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't manage \`${role}\` because it's above your highest role.`
            );
    },

    alreadyHas(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Already has \`${role}\`.`
            );
    },

    notHas(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Doesn't have \`${role}\`.`
            );
    },


    // =========================
    // ADD ROLE
    // =========================

    success(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.add} ${user}: Added \`${role}\` to **${member.user.username}**.`
            );
    },

    failed(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't add \`${role}\` to **${member.user.username}**.`
            );
    },


    // =========================
    // REMOVE ROLE
    // =========================

    removeSuccess(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.remove} ${user}: Removed \`${role}\` from **${member.user.username}**.`
            );
    },

    removeFailed(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't remove \`${role}\` from **${member.user.username}**.`
            );
    }

};
