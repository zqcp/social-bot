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
    name: "ban",
    aliases: ["b"],
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
                    moderationHelp.ban(
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

        const reason =
            args.slice(1).join(" ") ||
            "No reason provided";

        try {
            await member.ban({
                reason
            });

            return message.channel.send({
                embeds: [
                    moderationEmbeds.banned(
                        message.author,
                        member.user,
                        reason
                    )
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    moderationEmbeds.banFailed(
                        message.author,
                        member.user
                    )
                ]
            });
        }
    }
};
