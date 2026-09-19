const {
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

const Jail =
    require("../../models/Jail");

const globalEmbeds =
    require("../../embeds/general/global");

const jailEmbeds =
    require("../../embeds/general/jail");

module.exports = {
    name: "jail unsetup",
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

        const jail =
            await Jail.findOne({
                guildId:
                    message.guild.id
            });

        if (!jail) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.notSetup(
                        message.author
                    )
                ]
            });
        }

        const jailRole =
            message.guild.roles.cache.get(
                jail.roleId
            );

        const jailedMembers =
            Array.isArray(jail.members)
                ? jail.members
                : [];

        const jailedByRole =
            jailRole
                ? message.guild.members.cache.filter(
                    member =>
                        member.roles.cache.has(
                            jailRole.id
                        )
                ).size
                : 0;

        const jailedCount =
            Math.max(
                jailedMembers.length,
                jailedByRole
            );

        if (jailedCount > 0) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.unsetupBlocked(
                        message.author,
                        jailedCount
                    )
                ]
            });
        }

        if (
            jailRole &&
            !jailRole.editable
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botRole(
                        message.author
                    )
                ]
            });
        }

        if (jailRole) {
            const categories =
                message.guild.channels.cache.filter(
                    channel =>
                        channel.type ===
                        ChannelType.GuildCategory
                );

            for (
                const category
                of categories.values()
            ) {
                const overwrite =
                    category.permissionOverwrites.cache.get(
                        jailRole.id
                    );

                if (!overwrite) {
                    continue;
                }

                await category.permissionOverwrites
                    .delete(
                        jailRole.id
                    )
                    .catch(error => {
                        console.error(
                            `[JAIL] Failed to remove Jailed permission from category ${category.id}:`,
                            error
                        );
                    });
            }
        }

        const jailChannel =
            message.guild.channels.cache.get(
                jail.channelId
            );

        if (jailChannel) {
            await jailChannel
                .delete(
                    "Jail system unsetup"
                )
                .catch(error => {
                    console.error(
                        "[JAIL] Failed to delete jail channel:",
                        error
                    );
                });
        }

        const logChannel =
            message.guild.channels.cache.get(
                jail.logChannelId
            );

        if (logChannel) {
            await logChannel
                .delete(
                    "Jail system unsetup"
                )
                .catch(error => {
                    console.error(
                        "[JAIL] Failed to delete jail logs:",
                        error
                    );
                });
        }

        const category =
            message.guild.channels.cache.get(
                jail.categoryId
            );

        if (
            category &&
            category.type ===
                ChannelType.GuildCategory
        ) {
            await category
                .delete(
                    "Jail system unsetup"
                )
                .catch(error => {
                    console.error(
                        "[JAIL] Failed to delete jail category:",
                        error
                    );
                });
        }

        if (
            jailRole &&
            jailRole.editable
        ) {
            await jailRole
                .delete(
                    "Jail system unsetup"
                )
                .catch(error => {
                    console.error(
                        "[JAIL] Failed to delete jail role:",
                        error
                    );
                });
        }

        await Jail.deleteOne({
            guildId:
                message.guild.id
        });

        return message.channel.send({
            embeds: [
                jailEmbeds.removed(
                    message.author
                )
            ]
        });
    }
};
