const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const starboardEmbeds =
    require("../../embeds/general/starboard");

const Starboard =
    require("../../models/Starboard");

module.exports = {
    name: "starboard list",
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

        try {
            const starboards =
                await Starboard.find({
                    guildId:
                        message.guild.id
                });

            if (!starboards.length) {
                return message.channel.send({
                    embeds: [
                        starboardEmbeds.noStarboards(
                            message.author
                        )
                    ]
                });
            }

            const embed =
                new EmbedBuilder()
                    .setColor(
                        require("../../config").colors.primary
                    )
                    .setTitle(
                        "Starboards"
                    );

            const fields =
                starboards.map(
                    starboard => {

                        const channel =
                            message.guild.channels.cache.get(
                                starboard.channelId
                            );

                        return {
                            name:
                                channel
                                    ? channel.toString()
                                    : `Unknown Channel`,
                            value:
                                [
                                    `Emoji: ${starboard.emoji}`,
                                    `Threshold: \`${starboard.threshold}\``,
                                    `Self React: \`${starboard.selfReact ? "yes" : "no"}\``,
                                    `Color: \`${starboard.color}\``
                                ].join("\n"),
                            inline: false
                        };

                    }
                );

            embed.addFields(
                fields
            );

            return message.channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {
            console.error(
                "Starboard List Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    starboardEmbeds.failed(
                        message.author,
                        "loading"
                    )
                ]
            });
        }
    }
};
