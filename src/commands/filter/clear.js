const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const filterEmbeds =
    require("../../embeds/general/filter");

const Filter =
    require("../../models/Filter");

module.exports = {
    name: "filter clear",
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

            if (!filter) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.cleared(
                            message.author
                        )
                    ]
                });
            }

            filter.words = [];

            await filter.save();

            return message.channel.send({
                embeds: [
                    filterEmbeds.cleared(
                        message.author
                    )
                ]
            });

        } catch (error) {
            console.error(
                "Filter Clear Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "clear the filter"
                    )
                ]
            });
        }
    }
};
