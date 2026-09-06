const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const Embed =
    require("../../models/Embed");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "embed list",

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
        // FIND EMBEDS
        // =========================

        try {

            const embeds =
                await Embed.find({
                    guildId:
                        message.guild.id
                }).sort({
                    name: 1
                });

            if (!embeds.length) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.noEmbeds(
                            message.author
                        )
                    ]
                });
            }

            // =========================
            // BUILD LIST
            // =========================

            const description =
                embeds
                    .map(
                        (embed, index) =>
                            `**${index + 1}.** \`${embed.name}\``
                    )
                    .join("\n");

            return message.channel.send({
                embeds: [
                    globalEmbeds.regular(
                        `**Saved Embeds**\n\n${description}`
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Embed List Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    embedEmbeds.failed(
                        message.author
                    )
                ]
            });

        }

    }

};
