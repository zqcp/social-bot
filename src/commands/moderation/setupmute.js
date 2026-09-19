const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const muteEmbeds =
    require("../../embeds/general/mute");

const moderationHelp =
    require("../../embeds/help/moderation");

const GuildConfig =
    require("../../models/GuildConfig");

const Mute =
    require("../../models/Mute");

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
                    muteEmbeds.setupMissing(
                        message.author
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

        const muteConfig =
            await Mute.findOne({
                guildId: message.guild.id
            });

        if (
            muteConfig?.muteRoleId
        ) {
            const existingRole =
                message.guild.roles.cache.get(
                    muteConfig.muteRoleId
                );

            if (existingRole) {
                return message.channel.send({
                    embeds: [
                        muteEmbeds.alreadySetup(
                            message.author,
                            existingRole
                        )
                    ]
                });
            }
        }

        try {
            await Mute.findOneAndUpdate(
                {
                    guildId: message.guild.id
                },
                {
                    $set: {
                        guildId: message.guild.id,
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
                    muteEmbeds.setup(
                        message.author,
                        role
                    )
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    muteEmbeds.setupFailed(
                        message.author
                    )
                ]
            });
        }
    }
};
