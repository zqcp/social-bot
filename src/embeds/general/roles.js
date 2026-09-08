const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    // =========================
    // ERRORS
    // =========================

    memberNotFound(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find that \`member\`.`
            );
    },

    noRole(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Please provide a \`role\`.`
            );
    },

    roleNotFound(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Couldn't find that role matching \`${role}\`.`
            );
    },

    botRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I can't manage \`${role.name}\` because it's above my highest role.`
            );
    },

    userRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't manage \`${role.name}\` because it's above your highest role.`
            );
    },

    alreadyHas(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Already has \`${role.name}\`.`
            );
    },

    notHas(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Doesn't have \`${role.name}\`.`
            );
    },

    unavailable(user, style) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${style}\` roles aren't available or enabled.`
            );
    },

    invalidStyle(user, style) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${style}\` isn't a valid **role style**.`
            );
    },

    invalidColor(user, color) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${color}\` isn't a **valid color**.`
            );
    },

    invalidIcon(user, icon) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: ${icon} isn't a valid **role icon**.`
            );
    },

    // =========================
    // CREATE ROLE
    // =========================

    createSuccess(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.add} ${user}: Created **role** \`${role.name}\``
            );
    },

    createFailed(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't **create role** \`${role.name}\`.`
            );
    },

    // =========================
    // ROLE STYLES
    // =========================

    solid(user, role, color) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated \`${role.name}\` **role color** to \`${color}\`.`
            );
    },

    gradient(user, role, color1, color2) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated \`${role.name}\` **gradient color** to \`${color1}\` and \`${color2}\`.`
            );
    },

    holographic(user, role, style) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated \`${role.name}\` **holographic style** to \`${style}\`.`
            );
    },

    roleIcon(user, role, icon) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated \`${role.name}\` **role icon** to ${icon}.`
            );
    },

    // =========================
    // ADD ROLE
    // =========================

    success(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.add} ${user}: Added \`${role.name}\` to **${member.user.username}**.`
            );
    },

    failed(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't add \`${role.name}\` to **${member.user.username}**.`
            );
    },

    // =========================
    // REMOVE ROLE
    // =========================

    removeSuccess(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.remove} ${user}: Removed \`${role.name}\` from **${member.user.username}**.`
            );
    },

    removeFailed(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't remove \`${role.name}\` from **${member.user.username}**.`
            );
    },

    // =========================
    // DELETE ROLE
    // =========================

    deleteSuccess(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.remove} ${user}: Deleted **role** \`${role.name}\`.`
            );
    },

    deleteFailed(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: I couldn't **delete role** \`${role.name}\`.`
            );
    }

};
