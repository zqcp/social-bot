const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const helpEmbeds =
    require("../../embeds/help/embed");

const Embed =
    require("../../models/Embed");

const embedCreator =
    require("../../systems/embedCreator");

const panel =
    require("../../systems/embedCreator/panel");

module.exports = {
    name: "embed create",
    aliases: [],

    permissions: [
        PermissionFlagsBits.ManageMessages
    ],

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

        const name =
            args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    helpEmbeds.create(
                        message.author
                    )
                ]
            });
        }

        if (name.length > 100) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalidName(
                        message.author
                    )
                ]
            });
        }

        try {
            const existing =
                await Embed.findOne({
                    guildId: message.guild.id,
                    name
                });

            if (existing) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.invalidName(
                            message.author
                        )
                    ]
                });
            }

            const session =
                await embedCreator.start(
                    client,
                    message,
                    args
                );

            if (!session) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.failed(
                            message.author
                        )
                    ]
                });
            }

            embedCreator.update(
                message.author.id,
                {
                    name
                }
            );

            return message.channel.send(
                panel.build(
                    embedCreator.get(
                        message.author.id
                    )
                )
            );

        } catch (error) {
            console.error(
                "Embed Create Error:",
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
