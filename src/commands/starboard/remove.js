const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const starboardEmbeds =
    require("../../embeds/general/starboard");

const Starboard =
    require("../../models/Starboard");

module.exports = {
    name: "starboard remove",
    aliases: [],

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
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageMessages"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

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
                    globalEmbeds.botPermission(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        const channel =
            message.mentions.channels.first();

        if (!channel) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noChannel(
                        message.author
                    )
                ]
            });
        }

        const emoji =
            args.shift();

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noEmoji(
                        message.author
                    )
                ]
            });
        }

        try {
            const starboard =
                await Starboard.findOne({
                    guildId:
                        message.guild.id,
                    channelId:
                        channel.id,
                    emoji
                });

            if (!starboard) {
                return message.channel.send({
                    embeds: [
                        starboardEmbeds.notFound(
                            message.author
                        )
                    ]
                });
            }

            await Starboard.deleteOne({
                _id:
                    starboard._id
            });

            return message.channel.send({
                embeds: [
                    starboardEmbeds.removed(
                        message.author,
                        channel
                    )
                ]
            });

        } catch (error) {
            console.error(
                "Starboard Remove Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    starboardEmbeds.failed(
                        message.author,
                        "removing"
                    )
                ]
            });
        }
    }
};
