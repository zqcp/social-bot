const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

const globalEmbeds =
    require("../../embeds/general/global");

const filterEmbeds =
    require("../../embeds/general/filter");

const Filter =
    require("../../models/Filter");

module.exports = {
    name: "filter list",
    aliases: [],

    async execute(client, message, args) {
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

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

        try {
            const filter =
                await Filter.findOne({
                    guildId:
                        message.guild.id
                });

            if (
                !filter ||
                !filter.words.length
            ) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.empty(
                            message.author
                        )
                    ]
                });
            }

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.regular
                    )
                    .setAuthor({
                        name:
                            message.guild.name,
                        iconURL:
                            message.guild.iconURL({
                                dynamic: true
                            }) || undefined
                    })
                    .addFields({
                        name: "\u200B",
                        value:
                            `**blacklisted words**\n` +
                            filter.words
                                .map(
                                    (word, index) =>
                                        `\`${String(index + 1).padStart(2, "0")}\` **${word}**`
                                )
                                .join("\n")
                    });

            return message.channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {
            console.error(
                "Filter List Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "load the filter"
                    )
                ]
            });
        }
    }
};
