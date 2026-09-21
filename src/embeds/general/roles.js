const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // ERRORS
    // =========================

    roleNotFound(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Couldn't find a **role** matching \`${role}\`.`
            );
    },

    botRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I can't manage ${role} because it's above my highest role.`
            );
    },

    userRole(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't manage ${role} because it's above your highest role.`
            );
    },

    alreadyHas(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: **${member.user.username}** already has ${role}.`
            );
    },

    notHas(user, role, member) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: **${member.user.username}** doesn't have ${role}.`
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
                `${config.emojis.error} ${user}: \`${color}\` isn't a valid **color**.`
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
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Created **role** ${role}.`
            );
    },

    createFailed(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **create role** \`${role.name}\`. Please try again.`
            );
    },


    // =========================
    // ROLE STYLES
    // =========================

    solid(user, role, color) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated ${role} **role color** to \`${color}\`.`
            );
    },

    gradient(user, role, color1, color2) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated ${role} **gradient colors** to \`${color1}\` and \`${color2}\`.`
            );
    },

    holographic(user, role, style) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated ${role} **holographic style** to \`${style}\`.`
            );
    },

    roleIcon(user, role, icon) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Updated ${role} **role icon** to ${icon}.`
            );
    },


    // =========================
    // ADD ROLE
    // =========================

    success(user, role, member) {

        const roleName =
            Array.isArray(role)
                ? role.map(
                    currentRole =>
                        currentRole.toString()
                ).join(", ")
                : role?.toString?.() ||
                  role;

        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.add} ${user}: Added ${roleName} to **${member.user.username}**.`
            );
    },

    failed(user, role, member) {

        const roleName =
            Array.isArray(role)
                ? role.map(
                    currentRole =>
                        currentRole.toString()
                ).join(", ")
                : role?.toString?.() ||
                  role;

        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to add ${roleName} to **${member.user.username}**. Please try again.`
            );
    },


    // =========================
    // REMOVE ROLE
    // =========================

    removeSuccess(user, role, member) {

        const roleName =
            Array.isArray(role)
                ? role.map(
                    currentRole =>
                        currentRole.toString()
                ).join(", ")
                : role?.toString?.() ||
                  role;

        return new EmbedBuilder()
            .setColor(config.colors.role)
            .setDescription(
                `${config.emojis.remove} ${user}: Removed ${roleName} from **${member.user.username}**.`
            );
    },

    removeFailed(user, role, member) {

        const roleName =
            Array.isArray(role)
                ? role.map(
                    currentRole =>
                        currentRole.toString()
                ).join(", ")
                : role?.toString?.() ||
                  role;

        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to remove ${roleName} from **${member.user.username}**. Please try again.`
            );
    },


    // =========================
    // DELETE ROLE
    // =========================

    deleteSuccess(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Deleted **role** \`${role.name}\`.`
            );
    },

    deleteFailed(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to **delete role** \`${role.name}\`. Please try again.`
            );
    }

};
