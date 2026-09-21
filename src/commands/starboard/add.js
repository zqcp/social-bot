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

    name: "starboard add",

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
                "Starboard Add Error: Bot member could not be found."
            );

            return;
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AddReactions
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
        // CHANNEL
        // =========================

        const channel =
            message.mentions.channels.first();

        if (!channel) {
            return message.channel.send({
                embeds: [
                    starboardHelp.add(
                        message.author
                    )
                ]
            });
        }

        args.shift();

        // =========================
        // EMOJI
        // =========================

        const emoji =
            args.shift();

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    starboardHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // COLOR
        // =========================

        const color =
            args.shift();

        if (!color) {
            return message.channel.send({
                embeds: [
                    starboardHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // THRESHOLD
        // =========================

        const threshold =
            args.shift();

        if (!threshold) {
            return message.channel.send({
                embeds: [
                    starboardHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // SELF REACT
        // =========================

        const selfReact =
            args.shift();

        if (!selfReact) {
            return message.channel.send({
                embeds: [
                    starboardHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // THRESHOLD
        // =========================

        const reactionThreshold =
            Number(threshold);

        if (
            !Number.isInteger(
                reactionThreshold
            ) ||
            reactionThreshold <= 0
        ) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.invalidThreshold(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // SELF REACT
        // =========================

        const selfReaction =
            selfReact.toLowerCase();

        if (
            selfReaction !== "yes" &&
            selfReaction !== "no"
        ) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.invalidSelfReact(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // EMOJI
        // =========================

        const customEmoji =
            emoji.match(
                /^<a?:\w+:(\d+)>$/
            );

        const unicodeEmoji =
            emoji.length <= 8 &&
            !emoji.includes(" ");

        if (
            !customEmoji &&
            !unicodeEmoji
        ) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.invalidEmoji(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // COLOR
        // =========================

        let starboardColor =
            color;

        if (
            color.toLowerCase() !==
            "random"
        ) {

            if (
                !/^#?[0-9A-Fa-f]{6}$/.test(
                    color
                )
            ) {
                return message.channel.send({
                    embeds: [
                        starboardEmbeds.invalidColor(
                            message.author
                        )
                    ]
                });
            }

            if (
                !color.startsWith("#")
            ) {
                starboardColor =
                    `#${color}`;
            }

        } else {

            starboardColor =
                "random";

        }

        // =========================
        // CREATE STARBOARD
        // =========================

        try {

            const existing =
                await Starboard.findOne({
                    guildId:
                        message.guild.id,

                    channelId:
                        channel.id,

                    emoji
                });

            if (existing) {
                return message.channel.send({
                    embeds: [
                        starboardEmbeds.alreadyExists(
                            message.author,
                            channel
                        )
                    ]
                });
            }

            await Starboard.create({
                guildId:
                    message.guild.id,

                channelId:
                    channel.id,

                emoji,

                color:
                    starboardColor,

                threshold:
                    reactionThreshold,

                selfReact:
                    selfReaction === "yes"
            });

            return message.channel.send({
                embeds: [
                    starboardEmbeds.created(
                        message.author,
                        channel
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Starboard Add Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    starboardEmbeds.failed(
                        message.author,
                        "creating"
                    )
                ]
            });

        }

    }

};
