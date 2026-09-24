const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const antiNukeGeneral =
    require("../../embeds/antinuke/general");

const antiNukeProtection =
    require("../../embeds/antinuke/protection");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");


module.exports = {

    name:
        "antinuke channel",

    aliases: [],

    permissions: [
        PermissionFlagsBits.Administrator
    ],

    async execute(
        client,
        message,
        args
    ) {

        if (
            !message.guild
        ) {
            return;
        }


        // =========================
        // USER PERMISSIONS
        // =========================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "Administrator"
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
                `[ANTINUKE CHANNEL] Bot member missing in ${message.guild.id}.`
            );

            return;

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
                        .permissionsFor(
                            botMember
                        )
                        .has(
                            permission
                        )
            );

        if (
            missingPermissions.length
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermissions(
                        message.author,
                        missingPermissions
                    )
                ]
            });

        }


        // =========================
        // ANTINUKE ADMIN
        // =========================

        const antiNuke =
            await AntiNuke.findOne({
                guildId:
                    message.guild.id
            }).catch(
                error => {

                    console.error(
                        "[ANTINUKE CHANNEL]",
                        error
                    );

                    return null;

                }
            );

        const isOwner =
            message.guild.ownerId ===
            message.author.id;

        const isAntiNukeAdmin =
            antiNuke?.admins?.includes(
                message.author.id
            );

        if (
            !isOwner &&
            !isAntiNukeAdmin
        ) {

            return message.channel.send({
                embeds: [
                    antiNukeGeneral.owner(
                        message.author
                    )
                ]
            });

        }


        // =========================
        // CONFIGURE CHANNEL ANTINUKE
        // =========================

        const result =
            await manager.configure(
                message.guild.id,
                [
                    "channel",
                    ...args
                ]
            );


        // =========================
        // ERRORS
        // =========================

        if (
            result.error
        ) {

            if (
                result.error ===
                "module"
            ) {

                return message.channel.send({
                    embeds: [
                        antiNukeProtection.invalidModule(
                            message.author
                        )
                    ]
                });

            }

            if (
                result.error ===
                "status"
            ) {

                return message.channel.send({
                    embeds: [
                        antiNukeProtection.invalidStatus(
                            message.author,
                            "channel"
                        )
                    ]
                });

            }

            if (
                result.error ===
                "threshold"
            ) {

                return message.channel.send({
                    embeds: [
                        antiNukeProtection.invalidThreshold(
                            message.author,
                            "channel"
                        )
                    ]
                });

            }

            if (
                result.error ===
                "punishment"
            ) {

                return message.channel.send({
                    embeds: [
                        antiNukeProtection.invalidPunishment(
                            message.author,
                            "channel"
                        )
                    ]
                });

            }

            if (
                result.error ===
                "argument"
            ) {

                return message.channel.send({
                    embeds: [
                        antiNukeProtection.invalidArgument(
                            message.author,
                            "channel"
                        )
                    ]
                });

            }

        }


        // =========================
        // SUCCESS
        // =========================

        return message.channel.send({
            embeds: [
                antiNukeProtection.updated(
                    message.author,
                    result.module,
                    result.status,
                    result.threshold,
                    result.punishment
                )
            ]
        });

    }

};
