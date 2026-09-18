const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const moderationEmbeds =
    require("../../embeds/general/moderation");

const moderationHelp =
    require("../../embeds/help/moderation");

module.exports = {
    name: "unban",
    aliases: ["unb", "ub"],
    permissions: [
        PermissionFlagsBits.BanMembers
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
                PermissionFlagsBits.BanMembers
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "BanMembers"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.BanMembers
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        "BanMembers"
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
                    moderationHelp.unban(
                        message.author
                    )
                ]
            });
        }

        let user;

        try {
            user =
                await client.users.fetch(target);
        } catch (error) {
            user = null;
        }

        if (!user) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.userNotFound(
                        message.author,
                        target
                    )
                ]
            });
        }

        try {
            await message.guild.members.unban(
                user.id,
                "No reason provided"
            );

            return message.channel.send({
                embeds: [
                    moderationEmbeds.unbanned(
                        message.author,
                        user
                    )
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    moderationEmbeds.unbanFailed(
                        message.author,
                        user
                    )
                ]
            });
        }
    }
};
