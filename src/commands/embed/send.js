const {
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

const Embed = require("../../models/Embed");
const globalEmbeds = require("../../embeds/general/global");
const embedEmbeds = require("../../embeds/general/embed");
const webEditor = require("../../systems/embed/webEditor");

module.exports = {
    name: "embed send",
    aliases: ["embed s"],

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

        const name = args.shift()?.trim();

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

        const channelText = args.join(" ").trim();
        let channel = message.channel;

        if (channelText) {
            const id = channelText.replace(/[<#>]/g, "");
            channel = await message.guild.channels.fetch(id).catch(() => null);

            if (!channel || !channel.isTextBased()) {
                return message.channel.send({
                    embeds: [globalEmbeds.channelNotFound(message.author, channelText)]
                });
            }
        }

        const groups = webEditor.splitPayload({
            content: saved.content || "",
            embeds: saved.embeds || [],
            buttons: saved.buttons || [],
            selectMenus: saved.selectMenus || []
        });

        const sentMessages = [];

        for (const payload of groups) {
            const sent = await channel.send(payload);
            sentMessages.push({
                channelId: sent.channel.id,
                messageId: sent.id
            });
        }

        saved.channelId = channel.id;
        saved.sentMessages = sentMessages;
        await saved.save();

        return message.channel.send({
            embeds: [
                embedEmbeds.sent(
                    message.author,
                    name,
                    channel
                )
            ]
        });
    }
};
