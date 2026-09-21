const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const filterEmbeds =
    require("../../embeds/general/filter");

const filterHelp =
    require("../../embeds/help/filter");

const Filter =
    require("../../models/Filter");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "filter remove",

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
                "Filter Remove Error: Bot member could not be found."
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
        // WORD
        // =========================

        const word =
            args.join(" ").trim();

        if (!word) {
            return message.channel.send({
                embeds: [
                    filterHelp.remove(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // DATABASE
        // =========================

        try {

            const filter =
                await Filter.findOne({
                    guildId:
                        message.guild.id
                });

            if (!filter) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.notBlocked(
                            message.author,
                            word
                        )
                    ]
                });
            }

            // =========================
            // WORD CHECK
            // =========================

            const index =
                filter.words.findIndex(
                    current =>
                        current.toLowerCase() ===
                        word.toLowerCase()
                );

            if (index === -1) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.notBlocked(
                            message.author,
                            word
                        )
                    ]
                });
            }

            // =========================
            // REMOVE WORD
            // =========================

            filter.words.splice(
                index,
                1
            );

            await filter.save();

            return message.channel.send({
                embeds: [
                    filterEmbeds.removed(
                        message.author,
                        word
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Filter Remove Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "remove the word from the filter"
                    )
                ]
            });
        }

    }

};
