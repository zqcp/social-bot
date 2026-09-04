const { PermissionFlagsBits } = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const embed =
    require("../../embeds/general/embed");

module.exports = {

    name: "embed edit",

    async execute(client, message, args) {

        // =========================
        // USER PERMISSION
        // =========================

        if (
            !globalEmbeds.permission(
                message.member,
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.noPermission(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // EMBED NAME
        // =========================

        const name = args[0];

        if (!name) {
            return message.channel.send({
                embeds: [
                    embed.noName(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // FIND EMBED
        // =========================

        // Database lookup will go here
        // once the Embed model is connected.

        return message.channel.send({
            embeds: [
                embed.notFound(
                    message.author,
                    name
                )
            ]
        });
    }
};
