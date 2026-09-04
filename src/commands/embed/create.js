const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const Embed = require("../../models/Embed");
const config = require("../../config");

const globalEmbeds = require("../../embeds/general/global");
const embedEmbeds = require("../../embeds/general/embed");

const builder = require("../../systems/embed/builder");

module.exports = {

    name: "embed create",
    aliases: ["embed c"],

    async execute(client, message, args) {

        if (!message.guild) return;

        // =========================
        // PERMISSION
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
                        PermissionFlagsBits.ManageMessages
                    )
                ]
            });
        }

        // =========================
        // NAME
        // =========================

        const name = args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.noName(message.author)
                ]
            });
        }

        if (name.length > 100) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalidName(message.author)
                ]
            });
        }

        // =========================
        // CHECK EXISTING
        // =========================

        const existing = await Embed.findOne({
            guildId: message.guild.id,
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

        // =========================
        // CREATE SESSION
        // =========================

        const session = {

            userId: message.author.id,

            guildId: message.guild.id,

            messageId: null,

            channelId: message.channel.id,

            createdAt: Date.now(),

            updatedAt: Date.now(),

            data: {

                name,

                content: "",

                embeds: [
                    {
                        title: "",
                        description: "",
                        url: "",
                        color: null,

                        author: {
                            name: "",
                            url: "",
                            iconURL: ""
                        },

                        thumbnail: "",
                        image: "",

                        footer: {
                            text: "",
                            iconURL: ""
                        },

                        timestamp: false,

                        fields: []
                    }
                ],

                activeEmbed: 0,

                buttons: [],

                activeButton: null,

                selectMenus: [],

                activeSelectMenu: null
            }
        };

        // =========================
        // SESSION STORAGE
        // =========================

        if (!builder.sessions) {
            builder.sessions = new Map();
        }

        builder.sessions.set(
            message.author.id,
            session
        );

        // =========================
        // MAIN CONTROLS
        // =========================

        const row1 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("embed:content")
                    .setLabel("Content")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:embed")
                    .setLabel("Embeds")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:field")
                    .setLabel("Fields")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:button")
                    .setLabel("Buttons")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:select")
                    .setLabel("Select Menus")
                    .setStyle(ButtonStyle.Secondary)

            );

        // =========================
        // EMBED CONTROLS
        // =========================

        const row2 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("embed:add")
                    .setLabel("Add Embed")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:edit")
                    .setLabel("Edit Embed")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:remove")
                    .setLabel("Remove Embed")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("embed:previous")
                    .setLabel("Previous")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:next")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Secondary)

            );

        // =========================
        // FIELD CONTROLS
        // =========================

        const row3 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("embed:add_field")
                    .setLabel("Add Field")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:edit_field")
                    .setLabel("Edit Field")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:remove_field")
                    .setLabel("Remove Field")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("embed:move_field")
                    .setLabel("Move Field")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:preview")
                    .setLabel("Preview")
                    .setStyle(ButtonStyle.Secondary)

            );

        // =========================
        // BUTTON CONTROLS
        // =========================

        const row4 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("embed:add_button")
                    .setLabel("Add Button")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:edit_button")
                    .setLabel("Edit Button")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:remove_button")
                    .setLabel("Remove Button")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("embed:move_button")
                    .setLabel("Move Button")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:save")
                    .setLabel("Save")
                    .setStyle(ButtonStyle.Success)

            );

        // =========================
        // SELECT MENU CONTROLS
        // =========================

        const row5 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("embed:add_select")
                    .setLabel("Add Select Menu")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:edit_select")
                    .setLabel("Edit Select Menu")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:remove_select")
                    .setLabel("Remove Select Menu")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("embed:options")
                    .setLabel("Options")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("embed:cancel")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger)

            );

        // =========================
        // SEND EDITOR
        // =========================

        const editorMessage = await message.channel.send({

            content:
                `**Embed Builder**\n` +
                `Editing: \`${name}\``,

            components: [
                row1,
                row2,
                row3,
                row4,
                row5
            ]

        });

        // =========================
        // SAVE MESSAGE DATA
        // =========================

        session.messageId = editorMessage.id;

        session.channelId = message.channel.id;

        session.updatedAt = Date.now();

        builder.sessions.set(
            message.author.id,
            session
        );

    }

};
