const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const muteEmbeds =
    require("../../embeds/general/mute");

const GuildConfig =
    require("../../models/GuildConfig");

const Mute =
    require("../../models/Mute");

module.exports = {
    name: "remove mute",
    aliases: [],
    permissions: [
        PermissionFlagsBits.ManageRoles
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
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageRoles"
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

        if (args.length) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        args.join(" ")
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

        if (!muteConfig?.muteRoleId) {
            return message.channel.send({
                embeds: [
                    muteEmbeds.notSetup(
                        message.author
                    )
                ]
            });
        }

        try {
            await Mute.findOneAndDelete({
                guildId: message.guild.id
            });

            return message.channel.send({
                embeds: [
                    muteEmbeds.removed(
                        message.author
                    )
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    muteEmbeds.removeFailed(
                        message.author
                    )
                ]
            });
        }
    }
};
