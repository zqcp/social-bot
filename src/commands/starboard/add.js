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
    name: "starboard add",
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
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AddReactions
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

        const color =
            args.shift();

        if (!color) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noColor(
                        message.author
                    )
                ]
            });
        }

        const threshold =
            args.shift();

        if (!threshold) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noThreshold(
                        message.author
                    )
                ]
            });
        }

        const selfReact =
            args.shift();

        if (!selfReact) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noSelfReact(
                        message.author
                    )
                ]
            });
        }

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

        let starboardColor =
            color;

        if (
            color.toLowerCase() ===
            "random"
        ) {
            starboardColor =
                Math.floor(
                    Math.random() *
                    0xFFFFFF
                );
        } else {
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
        }

        try {
            const existing =
                await Starboard.findOne({
                    guildId:
                        message.guild.id,
                    channelId:
                        channel.id
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
