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

const blockedWords =
    require("../../systems/filter/blockedWords");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "filter add",

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
                "Filter Add Error: Bot member could not be found."
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
                    filterHelp.add(
                        message.author
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
                        enabled: false,
                        premade: false,
                        disabledPremade: [],
                        words: []
                    });
            }

            // =========================
            // ENABLED CHECK
            // =========================

            if (!filter.enabled) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.disabledStatus(
                            message.author
                        )
                    ]
                });
            }

            // =========================
            // PREMADE CHECK
            // =========================

            const premadeWord =
                blockedWords.find(
                    current =>
                        current.toLowerCase() ===
                        word.toLowerCase()
                );

            if (
                premadeWord &&
                filter.premade === true
            ) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.alreadyBlocked(
                            message.author,
                            word
                        )
                    ]
                });
            }

            // =========================
            // CUSTOM WORD CHECK
            // =========================

            const exists =
                filter.words.some(
                    current =>
                        current.toLowerCase() ===
                        word.toLowerCase()
                );

            if (exists) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.alreadyBlocked(
                            message.author,
                            word
                        )
                    ]
                });
            }

            // =========================
            // ADD WORD
            // =========================

            filter.words.push(
                word
            );

            await filter.save();

            return message.channel.send({
                embeds: [
                    filterEmbeds.added(
                        message.author,
                        word
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Filter Add Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "add the word to the filter"
                    )
                ]
            });
        }

    }

};
