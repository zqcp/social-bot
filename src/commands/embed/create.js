const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const embedCreator =
    require("../../systems/embedCreator");

const panel =
    require("../../systems/embedCreator/panel");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "embed create",

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
        // START CREATOR
        // =========================

        try {

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

            // =========================
            // CREATOR PANEL
            // =========================

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
