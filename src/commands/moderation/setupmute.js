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

const config =
    require("../../config");

module.exports = {
    name: "setup mute",
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

        const target =
            args[0];

        if (!target) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: Missing **mute role**.`
                        )
                ]
            });
        }

        const roleQuery =
            target.replace(/[<@&>]/g, "");

        let role =
            message.mentions.roles.first();

        if (!role && /^\d+$/.test(roleQuery)) {
            role =
                message.guild.roles.cache.get(
                    roleQuery
                );
        }

        if (!role) {
            role =
                message.guild.roles.cache.find(
                    role =>
                        role.name.toLowerCase() ===
                        target.toLowerCase()
                );
        }

        if (!role) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.roleNotFound(
                        message.author,
                        target
                    )
                ]
            });
        }

        if (
            role.managed ||
            role.id === message.guild.id
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
            role.position >=
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

        if (
            guildConfig?.muteRoleId
        ) {
            const existingRole =
                message.guild.roles.cache.get(
                    guildConfig.muteRoleId
                );

            if (existingRole) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(
                                config.colors.error
                            )
                            .setDescription(
                                `${config.emojis.error} ${message.author}: **mute role** is already set to ${existingRole}.`
                            )
                    ]
                });
            }
        }

        try {
            await GuildConfig.findOneAndUpdate(
                {
                    guildId: message.guild.id
                },
                {
                    $set: {
                        muteRoleId: role.id
                    }
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.success
                        )
                        .setDescription(
                            `${config.emojis.success} ${message.author}: **mute role** has been set to ${role}.`
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
                            `${config.emojis.failed} ${message.author}: Failed to **set the mute role**. Please try again.`
                        )
                ]
            });
        }
    }
};
