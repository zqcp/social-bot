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

    name: "starboard clear",

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
                "Starboard Clear Error: Bot member could not be found."
            );

            return;
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ReadMessageHistory
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
                    starboardHelp.clear(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // FIND STARBOARD
        // =========================

        try {

            const starboard =
                await Starboard.findOne({
                    guildId:
                        message.guild.id,

                    channelId:
                        channel.id
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

            // =========================
            // CLEAR MESSAGES
            // =========================

            let deleted = 0;

            while (true) {

                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                if (!messages.size) {
                    break;
                }

                const deletable =
                    messages.filter(
                        msg =>
                            !msg.pinned
                    );

                if (!deletable.size) {
                    break;
                }

                if (
                    deletable.size === 1
                ) {

                    await deletable
                        .first()
                        .delete();

                } else {

                    await channel.bulkDelete(
                        deletable,
                        true
                    );

                }

                deleted +=
                    deletable.size;

                if (
                    messages.size < 100
                ) {
                    break;
                }

            }

            return message.channel.send({
                embeds: [
                    starboardEmbeds.cleared(
                        message.author,
                        channel
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Starboard Clear Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    starboardEmbeds.failed(
                        message.author,
                        "clearing"
                    )
                ]
            });

        }

    }

};
