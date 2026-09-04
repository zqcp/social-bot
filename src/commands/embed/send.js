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

    name: "embed send",

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
        // TARGET CHANNEL
        // =========================

        const channel =
            message.mentions.channels.first();

        if (!channel) {
            return message.channel.send({
                content:
                    "You need to mention the channel where the embed should be sent."
            });
        }

        // =========================
        // BOT PERMISSIONS
        // =========================

        const permissions =
            channel.permissionsFor(
                message.guild.members.me
            );

        if (
            !permissions?.has(
                PermissionFlagsBits.ViewChannel
            ) ||
            !permissions?.has(
                PermissionFlagsBits.SendMessages
            ) ||
            !permissions?.has(
                PermissionFlagsBits.EmbedLinks
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
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
        // SEND EMBED
        // =========================

        await channel.send({
            content:
                savedEmbed.content || undefined,

            embeds:
                savedEmbed.embeds || []
        });

        // =========================
        // SUCCESS
        // =========================

        return message.channel.send({
            embeds: [
                embed.sent(
                    message.author,
                    name,
                    channel
                )
            ]
        });
    }
};
