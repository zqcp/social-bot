const { PermissionFlagsBits } = require("discord.js");

const Embed = require("../../models/Embed");
const globalEmbeds = require("../../embeds/general/global");
const embedEmbeds = require("../../embeds/general/embed");

module.exports = {
    name: "embed delete",
    aliases: ["embed d"],

    async execute(client, message, args) {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        PermissionFlagsBits.ManageMessages
                    )
                ]
            });
        }

        const name = args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [embedEmbeds.noName(message.author)]
            });
        }

        const saved = await Embed.findOne({
            guildId: message.guild.id,
            name
        });

        if (!saved) {
            return message.channel.send({
                embeds: [embedEmbeds.notFound(message.author, name)]
            });
        }

        await saved.deleteOne();

        return message.channel.send({
            embeds: [embedEmbeds.deleted(message.author, name)]
        });
    }
};
