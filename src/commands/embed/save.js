const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const embedCreator =
    require("../../systems/embedCreator");

const Embed =
    require("../../models/Embed");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "embed save",

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
        // NAME
        // =========================

        const name =
            args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.noName(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // VALIDATE NAME
        // =========================

        if (
            name.length < 1 ||
            name.length > 100
        ) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalidName(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // ACTIVE SESSION
        // =========================

        const session =
            embedCreator.get(
                message.author.id
            );

        if (!session) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.sessionExpired(
                        message.author
                    )
                ]
            });
        }

        if (
            session.guildId !==
            message.guild.id
        ) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalid(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // SAVE
        // =========================

        try {

            const existing =
                await Embed.findOne({
                    guildId:
                        message.guild.id,
                    name
                });

            if (existing) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.alreadyExists(
                            message.author,
                            name
                        )
                    ]
                });
            }

            const saved =
                await Embed.create({
                    guildId:
                        message.guild.id,

                    userId:
                        message.author.id,

                    name,

                    content:
                        session.content,

                    embed:
                        session.embed,

                    components:
                        session.components,

                    sentMessages:
                        session.sentMessages || []
                });

            if (!saved) {
                return message.channel.send({
                    embeds: [
                        embedEmbeds.failed(
                            message.author
                        )
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    embedEmbeds.created(
                        message.author,
                        name
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Embed Save Error:",
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
