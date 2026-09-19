const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const Jail =
    require("../../models/Jail");

const JailSystem =
    require("../../systems/Jail");

const globalEmbeds =
    require("../../embeds/general/global");

const jailEmbeds =
    require("../../embeds/general/jail");

module.exports = {
    name: "jail setup",
    aliases: [],
    permissions: [
        PermissionFlagsBits.ManageGuild
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
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageGuild"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

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

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        "ManageChannels"
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

        const existing =
            await Jail.findOne({
                guildId:
                    message.guild.id
            });

        if (existing) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.alreadySetup(
                        message.author
                    )
                ]
            });
        }

        let jailRole;

        try {
            jailRole =
                await message.guild.roles.create({
                    name: "Jailed",
                    reason: "Jail system setup"
                });
        } catch (error) {
            console.error(
                "[JAIL] Failed to create Jailed role:",
                error
            );

            return message.channel.send({
                embeds: [
                    jailEmbeds.setupFailed(
                        message.author
                    )
                ]
            });
        }

        if (
            jailRole.position >=
            botMember.roles.highest.position
        ) {
            await jailRole.delete().catch(() => {});

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        "ManageRoles"
                    )
                ]
            });
        }

        let jailChannel;

        try {
            jailChannel =
                await message.guild.channels.create({
                    name: "jail",
                    type: ChannelType.GuildText,
                    reason: "Jail system setup"
                });
        } catch (error) {
            console.error(
                "[JAIL] Failed to create jail channel:",
                error
            );

            await jailRole.delete().catch(() => {});

            return message.channel.send({
                embeds: [
                    jailEmbeds.setupFailed(
                        message.author
                    )
                ]
            });
        }

        let logChannel;

        try {
            logChannel =
                await message.guild.channels.create({
                    name: "jail-logs",
                    type: ChannelType.GuildText,
                    reason: "Jail system setup"
                });
        } catch (error) {
            console.error(
                "[JAIL] Failed to create jail logs channel:",
                error
            );

            await jailChannel.delete().catch(() => {});
            await jailRole.delete().catch(() => {});

            return message.channel.send({
                embeds: [
                    jailEmbeds.setupFailed(
                        message.author
                    )
                ]
            });
        }

        try {
            await Jail.create({
                guildId:
                    message.guild.id,

                roleId:
                    jailRole.id,

                categoryId:
                    null,

                channelId:
                    jailChannel.id,

                logChannelId:
                    logChannel.id,

                nextCase:
                    1,

                members:
                    []
            });
        } catch (error) {
            console.error(
                "[JAIL] Failed to save jail configuration:",
                error
            );

            await logChannel.delete().catch(() => {});
            await jailChannel.delete().catch(() => {});
            await jailRole.delete().catch(() => {});

            return message.channel.send({
                embeds: [
                    jailEmbeds.setupFailed(
                        message.author
                    )
                ]
            });
        }

        const synced =
            await JailSystem.sync(
                message.guild
            );

        if (!synced) {
            console.error(
                "[JAIL] Failed to synchronize jail permissions."
            );
        }

        return message.channel.send({
            embeds: [
                jailEmbeds.setup(
                    message.author,
                    jailRole
                )
            ]
        });
    }
};
