const {
    PermissionFlagsBits,
    EmbedBuilder
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
                        "${message.author}: Please choose **yes** or **no**."
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
            // ALREADY ENABLED
            // =========================

            if (
                option === "yes" &&
                filter.premade === true
            ) {

                const embed =
                    new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setDescription(
                            `${config.emojis.error} ${message.author}: Premade filter is already **enabled**.`
                        );

                return message.channel.send({
                    embeds: [embed]
                });
            }

            // =========================
            // ENABLE
            // =========================

            if (option === "yes") {

                filter.premade = true;

                await filter.save();

                const embed =
                    new EmbedBuilder()
                        .setColor(config.colors.success)
                        .setDescription(
                            `${config.emojis.success} ${message.author}: Premade filter has been **enabled**.`
                        );

                return message.channel.send({
                    embeds: [embed]
                });
            }

            // =========================
            // ALREADY DISABLED
            // =========================

            if (
                option === "no" &&
                filter.premade === false
            ) {

                const embed =
                    new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setDescription(
                            `${config.emojis.error} ${message.author}: Premade filter is already **disabled**.`
                        );

                return message.channel.send({
                    embeds: [embed]
                });
            }

            // =========================
            // DISABLE
            // =========================

            filter.premade = false;

            await filter.save();

            const embed =
                new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setDescription(
                        `${config.emojis.success} ${message.author}: Premade filter has been **disabled**.`
                    );

            return message.channel.send({
                embeds: [embed]
            });

        } catch (error) {

            console.error(
                "Filter Premade Error:",
                error
            );

            const embed =
                new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription(
                        `${config.emojis.error} ${message.author}: Failed to update the premade filter.`
                    );

            return message.channel.send({
                embeds: [embed]
            });
        }
    }
};
