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

// =========================
// COMMAND
// =========================

module.exports = {

    name: "embed delete",

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
        // NAME
        // =========================

        const name =
            args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    helpEmbeds.delete(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // DELETE
        // =========================

        try {

            const saved =
                await Embed.findOne({
                    guildId:
                        message.guild.id,
                    name
                });

            if (!saved) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.notFound(
                            message.author,
                            name
                        )
                    ]
                });
            }

            await Embed.deleteOne({
                _id: saved._id
            });

            return message.channel.send({
                embeds: [
                    embedEmbeds.deleted(
                        message.author,
                        name
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Embed Delete Error:",
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
