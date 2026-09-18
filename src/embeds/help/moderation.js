// src/embeds/help/moderation.js

const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    ban(user) {
        return new EmbedBuilder()
            .setTitle("Command: ban")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Ban a user from the server.
\`\`\`
Syntax:
${config.prefix}ban [member] [reason]
Example:
${config.prefix}ban @user spam
\`\`\``
            );
    },

    unban(user) {
        return new EmbedBuilder()
            .setTitle("Command: unban")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Unban a user from the server.
\`\`\`
Syntax:
${config.prefix}unban [member]
Example:
${config.prefix}unban 123456789012345678
\`\`\``
            );
    },

    unbanall(user) {
        return new EmbedBuilder()
            .setTitle("Command: unbanall")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Unban all users from the server.
\`\`\`
Syntax:
${config.prefix}unbanall
Example:
${config.prefix}unbanall
\`\`\``
            );
    },

    hardban(user) {
        return new EmbedBuilder()
            .setTitle("Command: hardban")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Ban a user and delete their recent messages.
\`\`\`
Syntax:
${config.prefix}hardban [member] [reason]
Example:
${config.prefix}hardban @user spam
\`\`\``
            );
    },

    unhardban(user) {
        return new EmbedBuilder()
            .setTitle("Command: unhardban")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove a user's hardban.
\`\`\`
Syntax:
${config.prefix}unhardban [member]
Example:
${config.prefix}unhardban 123456789012345678
\`\`\``
            );
    },

    kick(user) {
        return new EmbedBuilder()
            .setTitle("Command: kick")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Kick a user from the server.
\`\`\`
Syntax:
${config.prefix}kick [member] [reason]
Example:
${config.prefix}kick @user spam
\`\`\``
            );
    },

    accept(user) {
        return new EmbedBuilder()
            .setTitle("Command: accept")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Accept a pending server join request.
\`\`\`
Syntax:
${config.prefix}accept [member]
Example:
${config.prefix}accept @user
\`\`\``
            );
    },

    jail(user) {
        return new EmbedBuilder()
            .setTitle("Command: jail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Restrict a user using the configured jail role.
\`\`\`
Syntax:
${config.prefix}jail [member] [reason]
Example:
${config.prefix}jail @user spam
\`\`\``
            );
    },

    unjail(user) {
        return new EmbedBuilder()
            .setTitle("Command: unjail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Release a user from jail.
\`\`\`
Syntax:
${config.prefix}unjail [member]
Example:
${config.prefix}unjail @user
\`\`\``
            );
    },

    timeout(user) {
        return new EmbedBuilder()
            .setTitle("Command: timeout")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Timeout a user.
\`\`\`
Syntax:
${config.prefix}timeout [member] [duration] [reason]
Example:
${config.prefix}timeout @user 10m spam
\`\`\``
            );
    },

    untimeout(user) {
        return new EmbedBuilder()
            .setTitle("Command: untimeout")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove a user's timeout.
\`\`\`
Syntax:
${config.prefix}untimeout [member]
Example:
${config.prefix}untimeout @user
\`\`\``
            );
    },

    mute(user) {
        return new EmbedBuilder()
            .setTitle("Command: mute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Mute a user.
\`\`\`
Syntax:
${config.prefix}mute [member] [reason]
Example:
${config.prefix}mute @user spam
\`\`\``
            );
    },

    unmute(user) {
        return new EmbedBuilder()
            .setTitle("Command: unmute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Unmute a user.
\`\`\`
Syntax:
${config.prefix}unmute [member]
Example:
${config.prefix}unmute @user
\`\`\``
            );
    },

    imagemute(user) {
        return new EmbedBuilder()
            .setTitle("Command: imagemute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Prevent a user from sending images and media.
\`\`\`
Syntax:
${config.prefix}imagemute [member] [reason]
Example:
${config.prefix}imagemute @user spam
\`\`\``
            );
    },

    imageunmute(user) {
        return new EmbedBuilder()
            .setTitle("Command: imageunmute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Allow a user to send images and media again.
\`\`\`
Syntax:
${config.prefix}imageunmute [member]
Example:
${config.prefix}imageunmute @user
\`\`\``
            );
    },

    reactionmute(user) {
        return new EmbedBuilder()
            .setTitle("Command: reactionmute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Prevent a user from using reactions.
\`\`\`
Syntax:
${config.prefix}reactionmute [member] [reason]
Example:
${config.prefix}reactionmute @user spam
\`\`\``
            );
    },

    reactionunmute(user) {
        return new EmbedBuilder()
            .setTitle("Command: reactionunmute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Allow a user to use reactions again.
\`\`\`
Syntax:
${config.prefix}reactionunmute [member]
Example:
${config.prefix}reactionunmute @user
\`\`\``
            );
    },

    setupmute(user) {
        return new EmbedBuilder()
            .setTitle("Command: setupmute")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Set up the roles required for mute systems.
\`\`\`
Syntax:
${config.prefix}setupmute
Example:
${config.prefix}setupmute
\`\`\``
            );
    },

    warn(user) {
        return new EmbedBuilder()
            .setTitle("Command: warn")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Warn a user.
\`\`\`
Syntax:
${config.prefix}warn [member] [reason]
Example:
${config.prefix}warn @user spam
\`\`\``
            );
    },

    warnings(user) {
        return new EmbedBuilder()
            .setTitle("Command: warnings")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View a user's warnings.
\`\`\`
Syntax:
${config.prefix}warnings [member]
Example:
${config.prefix}warnings @user
\`\`\``
            );
    },

    clearwarnings(user) {
        return new EmbedBuilder()
            .setTitle("Command: clearwarnings")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Clear all warnings from a user.
\`\`\`
Syntax:
${config.prefix}clearwarnings [member]
Example:
${config.prefix}clearwarnings @user
\`\`\``
            );
    },

    strip(user) {
        return new EmbedBuilder()
            .setTitle("Command: strip")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove all removable roles from a user.
\`\`\`
Syntax:
${config.prefix}strip [member]
Example:
${config.prefix}strip @user
\`\`\``
            );
    },

    autostrip(user) {
        return new EmbedBuilder()
            .setTitle("Command: autostrip")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Manage automatic role protection.
\`\`\`
Syntax:
${config.prefix}autostrip [add/remove] [member]
Example:
${config.prefix}autostrip add @user
\`\`\``
            );
    },

    rolehistory(user) {
        return new EmbedBuilder()
            .setTitle("Command: rolehistory")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View a user's role history.
\`\`\`
Syntax:
${config.prefix}rolehistory [member]
Example:
${config.prefix}rolehistory @user
\`\`\``
            );
    },

    modstats(user) {
        return new EmbedBuilder()
            .setTitle("Command: modstats")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View moderator action statistics.
\`\`\`
Syntax:
${config.prefix}modstats
Example:
${config.prefix}modstats
\`\`\``
            );
    },

    modhistory(user) {
        return new EmbedBuilder()
            .setTitle("Command: modhistory")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View a user's moderation history.
\`\`\`
Syntax:
${config.prefix}modhistory [member]
Example:
${config.prefix}modhistory @user
\`\`\``
            );
    },

    hide(user) {
        return new EmbedBuilder()
            .setTitle("Command: hide")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Hide a channel from @everyone.
\`\`\`
Syntax:
${config.prefix}hide
Example:
${config.prefix}hide
\`\`\``
            );
    },

    unhide(user) {
        return new EmbedBuilder()
            .setTitle("Command: unhide")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Unhide a channel for @everyone.
\`\`\`
Syntax:
${config.prefix}unhide
Example:
${config.prefix}unhide
\`\`\``
            );
    },

    lock(user) {
        return new EmbedBuilder()
            .setTitle("Command: lock")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Lock a channel.
\`\`\`
Syntax:
${config.prefix}lock
Example:
${config.prefix}lock
\`\`\``
            );
    },

    unlock(user) {
        return new EmbedBuilder()
            .setTitle("Command: unlock")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Unlock a channel.
\`\`\`
Syntax:
${config.prefix}unlock
Example:
${config.prefix}unlock
\`\`\``
            );
    },

    nuke(user) {
        return new EmbedBuilder()
            .setTitle("Command: nuke")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Clear all messages from a channel.
\`\`\`
Syntax:
${config.prefix}nuke
Example:
${config.prefix}nuke
\`\`\``
            );
    },

    purge(user) {
        return new EmbedBuilder()
            .setTitle("Command: purge")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Delete multiple messages from a channel.
\`\`\`
Syntax:
${config.prefix}purge [amount]
Example:
${config.prefix}purge 100
\`\`\``
            );
    },

    slowmode(user) {
        return new EmbedBuilder()
            .setTitle("Command: slowmode")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Set the slowmode for a channel.
\`\`\`
Syntax:
${config.prefix}slowmode [duration]
Example:
${config.prefix}slowmode 10s
\`\`\``
            );
    }

};
