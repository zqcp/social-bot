const {
    PermissionFlagsBits
} = require("discord.js");

const {
    Embed
} = require("../../models/Embed");

const globalEmbeds =
    require("../../embeds/general/global");

const embed =
    require("../../embeds/general/embed");

module.exports = {

    name: "embed delete",

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

        const savedEmbed =
            await Embed.findOne({
                guildId: message.guild.id,
                name: name
            });

        if (!savedEmbed) {
            return message.channel.send({
                embeds: [
                    embed.notFound(
                        message.author,
                        name
                    )
                ]
            });
        }

        // =========================
        // DELETE EMBED
        // =========================

        await Embed.deleteOne({
            _id: savedEmbed._id
        });

        // =========================
        // SUCCESS
        // =========================

        return message.channel.send({
            embeds: [
                embed.deleted(
                    message.author,
                    name
                )
            ]
        });
    }
};
