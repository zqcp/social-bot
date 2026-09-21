const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const VoiceLeaderboard =
    require("../../embeds/leaderboard/voice");

const LeaderboardConfig =
    require("../../models/LeaderboardConfig");


module.exports = {

    name: "set vclb",

    aliases: [],

    permissions: [
        PermissionFlagsBits.ManageGuild
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
            return;
        }


        // =========================
        // USER PERMISSIONS
        // =========================

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


        // =========================
        // BOT MEMBER
        // =========================

        const botMember =
            message.guild.members.me;

        if (!botMember) {

            console.error(
                "[VOICE LB] Bot member could not be resolved."
            );

            return;

        }


        // =========================
        // BOT PERMISSIONS
        // =========================

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ReadMessageHistory
        ];


        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !message.channel
                        .permissionsFor(botMember)
                        .has(permission)
            );


        if (
            missingPermissions.length
        ) {

            const permissionNames =
                missingPermissions.map(
                    permission => {

                        if (
                            permission ===
                            PermissionFlagsBits.ViewChannel
                        ) {
                            return "ViewChannel";
                        }

                        if (
                            permission ===
                            PermissionFlagsBits.SendMessages
                        ) {
                            return "SendMessages";
                        }

                        if (
                            permission ===
                            PermissionFlagsBits.EmbedLinks
                        ) {
                            return "EmbedLinks";
                        }

                        if (
                            permission ===
                            PermissionFlagsBits.ReadMessageHistory
                        ) {
                            return "ReadMessageHistory";
                        }

                        return permission;

                    }
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

        if (!args[0]) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "channel"
                    )
                ]
            });

        }


        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(
                args[0]
            );


        if (
            !channel ||
            !channel.isTextBased()
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.channelNotFound(
                        message.author,
                        args[0]
                    )
                ]
            });

        }


        // =========================
        // LEADERBOARD CONFIG
        // =========================

        let data =
            await LeaderboardConfig.findOne({
                guildId:
                    message.guild.id
            });


        const now =
            new Date();


        if (!data) {

            data =
                new LeaderboardConfig({

                    guildId:
                        message.guild.id,

                    weekStartedAt:
                        now,

                    nextWipeAt:
                        new Date(
                            now.getTime() +
                            7 *
                            24 *
                            60 *
                            60 *
                            1000
                        )

                });

        }


        // =========================
        // EXISTING MESSAGE
        // =========================

        let leaderboardMessage =
            null;


        if (
            data.voiceChannelId &&
            data.voiceMessageId
        ) {

            const oldChannel =
                message.guild.channels.cache.get(
                    data.voiceChannelId
                );


            if (
                oldChannel &&
                oldChannel.isTextBased()
            ) {

                leaderboardMessage =
                    await oldChannel.messages
                        .fetch(
                            data.voiceMessageId
                        )
                        .catch(
                            () => null
                        );

            }

        }


        // =========================
        // LEADERBOARD EMBED
        // =========================

        const embed =
            VoiceLeaderboard.create(
                message.guild,
                [],
                data.nextWipeAt
            );


        // =========================
        // UPDATE / CREATE
        // =========================

        try {

            if (
                leaderboardMessage
            ) {

                await leaderboardMessage.edit({
                    embeds: [
                        embed
                    ]
                });

            } else {

                leaderboardMessage =
                    await channel.send({
                        embeds: [
                            embed
                        ]
                    });

            }


            // =========================
            // SAVE CONFIG
            // =========================

            data.voiceChannelId =
                channel.id;

            data.voiceMessageId =
                leaderboardMessage.id;


            await data.save();


            // =========================
            // SUCCESS
            // =========================

            return message.channel.send({
                embeds: [
                    globalEmbeds.created(
                        message.author,
                        "Voice Leaderboard",
                        channel
                    )
                ]
            });

        } catch (error) {

            console.error(
                "[VOICE LB SETUP]",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "set the Voice Leaderboard"
                    )
                ]
            });

        }

    }

};
