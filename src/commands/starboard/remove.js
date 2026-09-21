const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const starboardEmbeds =
    require("../../embeds/general/starboard");

const starboardHelp =
    require("../../embeds/help/starboard");

const Starboard =
    require("../../models/Starboard");

module.exports = {

    name: "starboard remove",

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
                "Starboard Remove Error: Bot member could not be found."
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
        // CHANNEL CHECK
        // =========================

        const channel =
            message.mentions.channels.first();

        if (!channel) {
            return message.channel.send({
                embeds: [
                    starboardHelp.remove(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // EMOJI CHECK
        // =========================

        const emoji =
            args[0];

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    starboardHelp.remove(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // REMOVE STARBOARD
        // =========================

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
