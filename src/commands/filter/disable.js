const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const filterEmbeds =
    require("../../embeds/general/filter");

const Filter =
    require("../../models/Filter");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "filter enable",

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
                "Filter Enable Error: Bot member could not be found."
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

            if (permissionNames.length === 1) {
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
        // DATABASE
        // =========================

        try {

            let filter =
                await Filter.findOne({
                    guildId:
                        message.guild.id
                });

            if (!filter) {

                filter =
                    await Filter.create({
                        guildId:
                            message.guild.id,
                        enabled: true,
                        premade: false,
                        disabledPremade: [],
                        words: []
                    });

                return message.channel.send({
                    embeds: [
                        filterEmbeds.enabled(
                            message.author
                        )
                    ]
                });
            }

            // =========================
            // ALREADY ENABLED
            // =========================

            if (filter.enabled) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.alreadyEnabled(
                            message.author
                        )
                    ]
                });
            }

            // =========================
            // ENABLE FILTER
            // =========================

            filter.enabled = true;

            await filter.save();

            return message.channel.send({
                embeds: [
                    filterEmbeds.enabled(
                        message.author
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Filter Enable Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "enable the filter"
                    )
                ]
            });
        }

    }

};
