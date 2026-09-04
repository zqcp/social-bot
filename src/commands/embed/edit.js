const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const Embed = require("../../models/Embed");
const globalEmbeds = require("../../embeds/general/global");
const embedEmbeds = require("../../embeds/general/embed");
const webEditor = require("../../systems/embed/webEditor");


module.exports = {
    name: "embed edit",
    aliases: ["embed e"],

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

        const savedEmbed = await Embed.findOne({
            guildId: message.guild.id,
            name
        });

        if (!savedEmbed) {
            return message.channel.send({
                embeds: [embedEmbeds.notFound(message.author, name)]
            });
        }

        const session = webEditor.createSession({
            userId: message.author.id,
            guildId: message.guild.id,
            name: savedEmbed.name,
            edit: true,
            data: {
                content: savedEmbed.content || "",
                embeds: savedEmbed.embeds || [],
                buttons: savedEmbed.buttons || [],
                selectMenus: savedEmbed.selectMenus || [],
                channelId: savedEmbed.channelId || message.channel.id
            }
        });

        const builderData = {
            content: savedEmbed.content || "",
            embeds: savedEmbed.embeds || []
        };

        const encoded = Buffer.from(
            encodeURIComponent(JSON.stringify(builderData)),
            "utf8"
        ).toString("base64");

        const url = `${getEditorBaseUrl()}/embedbuilder/?token=${encodeURIComponent(session.token)}&data=${encodeURIComponent(encoded)}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Open Embed Builder")
                .setStyle(ButtonStyle.Link)
                .setURL(url)
        );

        return message.channel.send({
            content: `**Embed Builder**\nEditing: \`${name}\``,
            components: [row]
        });
    }
};
