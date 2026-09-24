const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const antiNukeGeneral =
    require("../../embeds/antinuke/general");

const channelLogs =
    require("../../systems/antinuke/logs/channel");


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

        const channel =
            message.channel;

        const user =
            message.author;

        const created =
            channelLogs.event(
                user,
                "created",
                channel,
                [
                    `${channel.name} — created`
                ],
                "Test event only. No channel was created."
            );

        const updated =
            channelLogs.event(
                user,
                "updated",
                channel,
                [
                    "Name changed",
                    "Topic changed",
                    "Permission overwrite changed"
                ],
                "Test event only. No channel was updated."
            );

        const deleted =
            channelLogs.event(
                user,
                "deleted",
                channel,
                [
                    `${channel.name} — deleted`,
                    "Permission overwrites detected"
                ],
                "Test event only. No channel was deleted."
            );

        const triggered =
            channelLogs.triggered(
                user,
                8,
                5,
                [
                    `${channel.name} — deleted`,
                    "#rules — deleted",
                    "#media — deleted",
                    "#staff — deleted",
                    "#general — deleted"
                ],
                "ban",
                "Successfully applied",
                channel
            );

        const recovery =
            channelLogs.recovery(
                user,
                [
                    channel
                ],
                [
                    `${channel.name} — recreated`,
                    "Permission overwrites restored",
                    "Channel settings restored"
                ],
                "Successfully recovered"
            );

        return message.channel.send({
            embeds: [
                created,
                updated,
                deleted,
                triggered,
                recovery
            ]
        });

    }

};
