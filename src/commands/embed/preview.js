const { PermissionFlagsBits } = require("discord.js");

const Embed = require("../../models/Embed");
const globalEmbeds = require("../../embeds/general/global");
const embedEmbeds = require("../../embeds/general/embed");
const webEditor = require("../../systems/embed/webEditor");

module.exports = {
    name: "embed preview",
    aliases: ["embed p"],

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

        const groups = webEditor.splitPayload({
            content: saved.content || "",
            embeds: saved.embeds || [],
            buttons: saved.buttons || [],
            selectMenus: saved.selectMenus || []
        });

        for (const payload of groups) {
            await message.channel.send(payload);
        }
    }
};
