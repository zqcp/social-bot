const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const config =
    require("../../config");

const Embed =
    require("../../models/Embed");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "embed list",

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
                        message.guild.id,
                    userId:
                        message.author.id
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
                        (saved, index) =>
                            `**${index + 1}.** \`${saved.name}\``
                    )
                    .join("\n");

            const embed =
                new EmbedBuilder()
                    .setTitle("Saved Embeds")
                    .setAuthor({
                        name:
                            message.author.username,
                        iconURL:
                            message.author.displayAvatarURL({
                                dynamic: true
                            })
                    })
                    .setColor(
                        config.colors.regular
                    )
                    .setDescription(
                        description
                    );

            return message.channel.send({
                embeds: [
                    embed
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
