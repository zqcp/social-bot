const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const starboardEmbeds =
    require("../../embeds/general/starboard");

const Starboard =
    require("../../models/Starboard");

module.exports = {
    name: "starboard clear",
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
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ReadMessageHistory
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

        const channel =
            message.mentions.channels.first();

        if (!channel) {
            return message.channel.send({
                embeds: [
                    starboardEmbeds.noChannel(
                        message.author
                    )
                ]
            });
        }

        try {
            const starboard =
                await Starboard.findOne({
                    guildId:
                        message.guild.id,
                    channelId:
                        channel.id
                });

            if (!starboard) {
                return message.channel.send({
                    embeds: [
                        starboardEmbeds.notFound(
                            message.author
                        )
                    ]
                });
            }

            let deleted = 0;

            while (true) {
                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                if (!messages.size) {
                    break;
                }

                const deletable =
                    messages.filter(
                        msg =>
                            !msg.pinned
                    );

                if (!deletable.size) {
                    break;
                }

                if (deletable.size === 1) {
                    await deletable.first().delete();
                } else {
                    await channel.bulkDelete(
                        deletable,
                        true
                    );
                }

                deleted +=
                    deletable.size;

                if (
                    messages.size < 100
                ) {
                    break;
                }
            }

            return message.channel.send({
                embeds: [
                    starboardEmbeds.cleared(
                        message.author,
                        channel
                    )
                ]
            });

        } catch (error) {
            console.error(
                "Starboard Clear Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    starboardEmbeds.failed(
                        message.author,
                        "clearing"
                    )
                ]
            });
        }
    }
};
