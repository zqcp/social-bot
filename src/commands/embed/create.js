const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const Embed =
    require("../../models/Embed");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");

const builder =
    require("../../systems/embed/builder");


// ============================================================
// CREATE
// ============================================================

module.exports = {

    name: "embed create",

    aliases: ["embed c"],

    async execute(client, message, args) {

        if (!message.guild) return;


        // ======================================================
        // USER PERMISSION
        // ======================================================

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


        // ======================================================
        // BOT PERMISSIONS
        // ======================================================

        const botPermissions = [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        if (
            !message.guild.members.me.permissions.has(
                botPermissions
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        botPermissions
                    )
                ]
            });
        }


        // ======================================================
        // NAME
        // ======================================================

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

        if (name.length > 100) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalidName(
                        message.author
                    )
                ]
            });
        }


        // ======================================================
        // CHECK EXISTING EMBED
        // ======================================================

        const existing =
            await Embed.findOne({
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


        // ======================================================
        // CHECK EXISTING SESSION
        // ======================================================

        if (!builder.sessions) {
            builder.sessions = new Map();
        }

        const existingSession =
            builder.sessions.get(
                message.author.id
            );

        if (
            existingSession &&
            existingSession.guildId === message.guild.id
        ) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalid(
                        message.author,
                        "You already have an active embed editor."
                    )
                ]
            });
        }


        // ======================================================
        // CREATE SESSION
        // ======================================================

        const session = {

            userId:
                message.author.id,

            guildId:
                message.guild.id,

            messageId:
                null,

            channelId:
                message.channel.id,

            createdAt:
                Date.now(),

            updatedAt:
                Date.now(),

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


        // ======================================================
        // STORE SESSION
        // ======================================================

        builder.sessions.set(
            message.author.id,
            session
        );


        // ======================================================
        // MAIN EDITOR
        // ======================================================

        const row1 =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("embed:content")
                        .setLabel("Content")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:embeds")
                        .setLabel("Embeds")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:fields")
                        .setLabel("Fields")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:buttons")
                        .setLabel("Buttons")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:selects")
                        .setLabel("Select Menus")
                        .setStyle(ButtonStyle.Secondary)
                );


        const row2 =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("embed:preview")
                        .setLabel("Preview")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:save")
                        .setLabel("Save")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId("embed:send")
                        .setLabel("Send")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId("embed:cancel")
                        .setLabel("Cancel")
                        .setStyle(ButtonStyle.Danger)
                );


        // ======================================================
        // SEND EDITOR
        // ======================================================

        let editor;

        try {

            editor =
                await message.channel.send({

                    content:
                        `**Embed Editor:** \`${name}\``,

                    components: [
                        row1,
                        row2
                    ]
                });

        } catch (error) {

            console.error(
                "Embed editor error:",
                error
            );

            builder.sessions.delete(
                message.author.id
            );

            return message.channel.send({
                embeds: [
                    embedEmbeds.failed(
                        "open the embed editor"
                    )
                ]
            });
        }


        // ======================================================
        // STORE EDITOR MESSAGE
        // ======================================================

        session.messageId =
            editor.id;

        session.updatedAt =
            Date.now();


        // ======================================================
        // CREATED
        // ======================================================

        return message.channel.send({
            embeds: [
                embedEmbeds.created(
                    message.author,
                    name
                )
            ]
        });
    }
};
