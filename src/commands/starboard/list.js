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

const config =
    require("../../config");

module.exports = {

    name: "starboard list",

    aliases: [],

    permissions: [
        PermissionFlagsBits.ManageMessages
    ],

    async execute(
        client,
        message,
        args
    ) {

        // =========================
        // GUILD CHECK
        // =========================

        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

        // =========================
        // USER PERMISSION
        // =========================

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

        // =========================
        // BOT PERMISSIONS
        // =========================

        const botMember =
            message.guild.members.me;

        if (!botMember) {
            console.error(
                "Starboard List Error: Bot member could not be found."
            );

            return;
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        const permissions =
            message.channel.permissionsFor(
                botMember
            );

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !permissions?.has(
                        permission
                    )
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

            if (
                permissionNames.length === 1
            ) {
                return message.channel.send({
                    embeds: [
                        globalEmbeds.botPermission(
                            message.author,
                            permissionNames[0]
                        )
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermissions(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // GET STARBOARDS
        // =========================

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

            // =========================
            // STARBOARD EMBED
            // =========================

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.regular
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
                                    : "Unknown Channel",

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
