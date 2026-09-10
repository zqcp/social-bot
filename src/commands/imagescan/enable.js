const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const imageScanEmbeds =
    require("../../embeds/general/imagescan");

const ImageScan =
    require("../../models/ImageScan");

module.exports = {
    name: "imagescan enable",
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
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageGuild"
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
            PermissionFlagsBits.ModerateMembers,
            PermissionFlagsBits.BanMembers
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

            const existing =
                await ImageScan.findOne({
                    guildId:
                        message.guild.id
                });

            if (existing?.enabled) {
                return message.channel.send({
                    embeds: [
                        imageScanEmbeds.alreadyEnabled(
                            message.author
                        )
                    ]
                });
            }

            if (existing) {

                existing.enabled =
                    true;

                await existing.save();

            } else {

                await ImageScan.create({
                    guildId:
                        message.guild.id,
                    enabled:
                        true
                });

            }

            return message.channel.send({
                embeds: [
                    imageScanEmbeds.setup(
                        message.author
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Image Scan Enable Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "Something went wrong while enabling image moderation."
                    )
                ]
            });

        }

    }
};
