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
    name: "embed create",
    aliases: ["embed c"],

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

        if (name.length > 100) {
            return message.channel.send({
                embeds: [embedEmbeds.invalidName(message.author)]
            });
        }

        const existing = await Embed.findOne({
            guildId: message.guild.id,
            name
        });

        if (existing) {
            return message.channel.send({
                embeds: [embedEmbeds.alreadyExists(message.author, name)]
            });
        }

        const session = webEditor.createSession({
            userId: message.author.id,
            guildId: message.guild.id,
            name,
            data: {
                content: "",
                embeds: [],
                buttons: [],
                selectMenus: [],
                channelId: message.channel.id
            },
            edit: false
        });

        const url = `${getEditorBaseUrl()}/embedbuilder/?token=${encodeURIComponent(session.token)}&data=${encodeURIComponent(
            Buffer.from(
                encodeURIComponent(JSON.stringify({
                    content: "",
                    embeds: []
                })),
                "utf8"
            ).toString("base64")
        )}`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Open Embed Builder")
                .setStyle(ButtonStyle.Link)
                .setURL(url)
        );

        return message.channel.send({
            content: `**Embed Builder**\nCreating: \`${name}\``,
            components: [row]
        });
    }
};
