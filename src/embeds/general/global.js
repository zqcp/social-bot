const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    // =========================
    // PERMISSIONS
    // =========================

    permission(user, permission) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You're **missing** permission: \`${permission}\`.`
            );
    },

    botPermission(user, permissions) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I do not have ${permissions
                    .map(permission => `\`${permission}\``)
                    .join(", ")} permissions.`
            );
    },

    permissionMultiple(user, permissions) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You're **missing** the following permissions: ${permissions
                    .map(permission => `\`${permission}\``)
                    .join(", ")}.`
            );
    },


    // =========================
    // MEMBER PROTECTION
    // =========================

    self(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't perform this action on yourself.`
            );
    },

    owner(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't perform this action on the server owner.`
            );
    },

    hierarchy(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: That member has an equal or higher role than you.`
            );
    },

    botRole(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I can't perform this action because their role is higher than mine.`
            );
    },


    // =========================
    // NOT FOUND
    // =========================

    notFound(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find that user. Check the username or ID and try again.`
            );
    },

    userNotFound(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find **${value}**. Check the username, mention, or ID and try again.`
            );
    },

    channelNotFound(user, channel) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find the channel ${channel}.`
            );
    },

    roleNotFound(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find the role ${role}.`
            );
    },


    // =========================
    // SUCCESS
    // =========================

    success(user, action, username, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${action} **${username}** for \`${reason || "No reason provided"}\`.`
            );
    },

    action(user, action, target) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: ${action} **${target}**.`
            );
    },

    created(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Successfully created ${type} **${name}**.`
            );
    },

    updated(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Successfully updated ${type} **${name}**.`
            );
    },

    deleted(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: Successfully deleted ${type} **${name}**.`
            );
    },


    // =========================
    // FAILED
    // =========================

    failed(user, action, username) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: ${action} **${username}** failed. Please try again.`
            );
    },

    actionFailed(user, action) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: **${action}** failed. Please try again.`
            );
    },


    // =========================
    // ERRORS
    // =========================

    error(description) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${description}`
            );
    },

    invalid(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: \`${value}\` is invalid.`
            );
    },

    missing(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You're missing \`${value}\`.`
            );
    },

    alreadyExists(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${value}** already exists.`
            );
    },

    unavailable(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: **${value}** is currently unavailable.`
            );
    },


    // =========================
    // CONFIRMATION
    // =========================

    confirmation(user, description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: ${description}`
            );
    },

    cancelled(user, description = "The action has been cancelled.") {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: ${description}`
            );
    },


    // =========================
    // COOLDOWN
    // =========================

    cooldown(user, seconds) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Please wait \`${seconds}s\` before using this again.`
            );
    },


    // =========================
    // GENERAL
    // =========================

    regular(description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },

    message(user, description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(
                `${user}: ${description}`
            );
    }

};
