const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const antiNukeGeneral =
    require("../../embeds/antinuke/general");

const channelLogs =
    require("../../embeds/antinuke/logs/channel");


module.exports = {

    name:
        "antinuke test",

    aliases: [],

    permissions: [
        PermissionFlagsBits.Administrator
    ],

    async execute(
        client,
        message
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
                `[ANTINUKE TEST] Bot member missing in ${message.guild.id}.`
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

        const AntiNuke =
            require("../../models/AntiNuke");

        const antiNuke =
            await AntiNuke.findOne({
                guildId:
                    message.guild.id
            }).catch(
                error => {

                    console.error(
                        "[ANTINUKE TEST]",
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
        // TEST CHANNEL EVENT
        // =========================

        const embed =
            channelLogs.event(
                message.author,
                "deleted",
                message.channel,
                [
                    `${message.channel.name} — deleted`,
                    "Permission overwrites detected"
                ],
                "Test event only. No channel was deleted."
            );

        return message.channel.send({
            embeds: [
                embed
            ]
        });

    }

};
