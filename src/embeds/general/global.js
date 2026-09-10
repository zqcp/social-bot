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
                `${config.emojis.error} ${user}: You're missing the \`${permission}\` permission.`
            );
    },

    permissions(user, permissions) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You're missing the following permissions: ${permissions
                    .map(permission => `\`${permission}\``)
                    .join(", ")}.`
            );
    },

    botPermission(user, permission) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I'm missing the \`${permission}\` permission.`
            );
    },

    botPermissions(user, permissions) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: I'm missing the following permissions: ${permissions
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
                `${config.emojis.error} ${user}: You can't do this to **yourself**.`
            );
    },

    owner(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You can't do this to the **server owner**.`
            );
    },

    hierarchy(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: That member has an **equal or higher role** than you.`
            );
    },

    botRole(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: My role is too low to manage **that member**.`
            );
    },


    // =========================
    // NOT FOUND
    // =========================

    userNotFound(user, value) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Couldn't find a **member** matching \`${value}\`.`
            );
    },

    memberNotFound(user) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide a \`member\`.`
            );
    },

    channelNotFound(user, channel) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Couldn't find ${channel}.`
            );
    },

    roleNotFound(user, role) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(
                `${config.emojis.error} ${user}: Couldn't find ${role}.`
            );
    },


    // =========================
    // SUCCESS
    // =========================

    success(user, action, target, reason) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${action}** ${target}${reason ? ` for \`${reason}\`` : ""}.`
            );
    },

    action(user, action, target) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${action}** ${target}.`
            );
    },

    created(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${type}** ${name} was created.`
            );
    },

    updated(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${type}** ${name} was updated.`
            );
    },

    deleted(user, type, name) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(
                `${config.emojis.success} ${user}: **${type}** ${name} was deleted.`
            );
    },


    // =========================
    // FAILED
    // =========================

    failed(user, action, target) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to ${action} ${target}. Please try again.`
            );
    },

    actionFailed(user, action) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(
                `${config.emojis.failed} ${user}: Failed to ${action}. Please try again.`
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
                `${config.emojis.error} ${user}: Missing **${value}**.`
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
                `${config.emojis.error} ${user}: **${value}** is unavailable.`
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

    cancelled(user, description = "Action cancelled.") {
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
                `${config.emojis.error} ${user}: Try again in \`${seconds}s\`.`
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
