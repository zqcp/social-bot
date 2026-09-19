const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const moderationHelp =
    require("../../embeds/help/moderation");

const GuildConfig =
    require("../../models/GuildConfig");

const Mute =
    require("../../models/Mute");

const config =
    require("../../config");

module.exports = {
    name: "unmute",
    aliases: ["unm", "um"],
    permissions: [
        PermissionFlagsBits.ModerateMembers
    ],

    async execute(client, message, args) {
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ModerateMembers
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ModerateMembers"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

        if (!botMember) {
            return;
        }

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        "ManageRoles"
                    )
                ]
            });
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !message.channel
                        .permissionsFor(botMember)
                        ?.has(permission)
            );

        if (missingPermissions.length) {
            const permissionNames =
                missingPermissions.map(
                    permission =>
                        Object.entries(
                            PermissionFlagsBits
                        ).find(
                            ([, value]) =>
                                value === permission
                        )?.[0] || permission
                );

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermissions(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        const target =
            args[0];

        if (!target) {
            return message.channel.send({
                embeds: [
                    moderationHelp.unmute(
                        message.author
                    )
                ]
            });
        }

        let member =
            message.mentions.members.first();

        if (!member) {
            member =
                await message.guild.members
                    .fetch(target)
                    .catch(() => null);
        }

        if (!member) {
            member =
                message.guild.members.cache.find(
                    member =>
                        member.user.username.toLowerCase() ===
                        target.toLowerCase()
                );
        }

        if (!member) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.userNotFound(
                        message.author,
                        target
                    )
                ]
            });
        }

        if (member.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.self(
                        message.author
                    )
                ]
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.owner(
                        message.author
                    )
                ]
            });
        }

        if (
            member.roles.highest.position >=
            message.member.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.hierarchy(
                        message.author
                    )
                ]
            });
        }

        if (
            member.roles.highest.position >=
            botMember.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botRole(
                        message.author
                    )
                ]
            });
        }

        const guildConfig =
            await GuildConfig.findOne({
                guildId: message.guild.id
            });

        const muteConfig =
            await Mute.findOne({
                guildId: message.guild.id
            });

        const muteRoleId =
            muteConfig?.muteRoleId;

        if (!muteRoleId) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "mute role"
                    )
                ]
            });
        }

        const muteRole =
            message.guild.roles.cache.get(
                muteRoleId
            );

        if (!muteRole) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        "mute role"
                    )
                ]
            });
        }

        if (
            muteRole.managed ||
            muteRole.id === message.guild.id
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        "mute role"
                    )
                ]
            });
        }

        if (
            muteRole.position >=
            botMember.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botRole(
                        message.author
                    )
                ]
            });
        }

        if (
            !member.roles.cache.has(
                muteRole.id
            )
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: **${member.user.username}** is already unmuted.`
                        )
                ]
            });
        }

        try {
            await member.roles.remove(
                muteRole,
                "Manual unmute."
            );

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription(
                            `${message.author}: ${member.user.username} is now unmuted.`
                        )
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.failed
                        )
                        .setDescription(
                            `${config.emojis.failed} ${message.author}: Failed to **unmute** **${member.user.username}**. Please try again.`
                        )
                ]
            });
        }
    }
};
