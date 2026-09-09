const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const Filter =
    require("../../models/Filter");

const config =
    require("../../config");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "filter premade",

    aliases: [],

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

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // OPTION
        // =========================

        const option =
            args[0]?.toLowerCase();

        if (
            option !== "yes" &&
            option !== "no"
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "Please choose **yes** or **no**."
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
            // ENABLE
            // =========================

            if (option === "yes") {

                filter.premade = true;

                await filter.save();

                return message.channel.send({
                    embeds: [
                        globalEmbeds.regular(
                            `${config.emojis.success} ${message.author}: Premade filter has been **enabled**.`
                        )
                    ]
                });
            }

            // =========================
            // DISABLE
            // =========================

            filter.premade = false;

            await filter.save();

            return message.channel.send({
                embeds: [
                    globalEmbeds.regular(
                        `${config.emojis.success} ${message.author}: Premade filter has been **disabled**.`
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Filter Premade Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "update the premade filter"
                    )
                ]
            });
        }
    }
};
