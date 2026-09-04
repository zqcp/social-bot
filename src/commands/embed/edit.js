const {
    PermissionFlagsBits
} = require("discord.js");

const Embed =
    require("../../models/Embed");

const builder =
    require("../../systems/embed/builder");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");


// ============================================================
// EDIT
// ============================================================

module.exports = {
    name: "embed edit",

    async execute(client, message, args) {

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
        // EMBED NAME
        // ======================================================

        const name =
            args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.noName()
                ]
            });
        }


        // ======================================================
        // FIND SAVED EMBED
        // ======================================================

        const savedEmbed =
            await Embed.findOne({
                guildId: message.guild.id,
                name
            });

        if (!savedEmbed) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.notFound(
                        name
                    )
                ]
            });
        }


        // ======================================================
        // CHECK ACTIVE SESSION
        // ======================================================

        const existingSession =
            builder.getSession(
                message.author.id,
                message.guild.id
            );

        if (existingSession) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.invalid(
                        "You already have an active embed editor session."
                    )
                ]
            });
        }


        // ======================================================
        // CREATE EDIT SESSION
        // ======================================================

        const session =
            builder.createSession(
                message.author.id,
                message.guild.id
            );

        if (!session) {
            return message.channel.send({
                embeds: [
                    embedEmbeds.failed(
                        "create the embed editor"
                    )
                ]
            });
        }


        // ======================================================
        // COPY SAVED DATA
        // ======================================================

        session.data.name =
            savedEmbed.name;

        session.data.guildId =
            savedEmbed.guildId;

        session.data.channelId =
            savedEmbed.channelId ||
            message.channel.id;

        session.data.content =
            savedEmbed.content || "";

        session.data.embeds =
            savedEmbed.embeds
                ? savedEmbed.embeds.map(
                    embed => embed.toObject
                        ? embed.toObject()
                        : embed
                )
                : [];

        session.data.buttons =
            savedEmbed.buttons
                ? savedEmbed.buttons.map(
                    button => button.toObject
                        ? button.toObject()
                        : button
                )
                : [];

        session.data.selectMenus =
            savedEmbed.selectMenus
                ? savedEmbed.selectMenus.map(
                    menu => menu.toObject
                        ? menu.toObject()
                        : menu
                )
                : [];

        session.data.activeEmbed =
            0;

        session.data.activeField =
            0;

        session.data.activeButton =
            0;

        session.data.activeSelectMenu =
            0;

        session.data.mode =
            "edit";

        session.data.embedId =
            savedEmbed._id.toString();

        session.ui =
            "main";


        // ======================================================
        // UPDATE SESSION
        // ======================================================

        builder.updateSession(
            session
        );


        // ======================================================
        // SEND EDITOR
        // ======================================================

        let editor;

        try {

            editor =
                await message.channel.send(
                    builder.renderEditor(
                        session
                    )
                );

        } catch (error) {

            console.error(
                "Embed editor error:",
                error
            );

            builder.deleteSession(
                message.author.id,
                message.guild.id
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

        session.editorMessageId =
            editor.id;

        session.editorChannelId =
            message.channel.id;

        builder.updateSession(
            session
        );


        // ======================================================
        // EDITOR OPENED
        // ======================================================

        return message.channel.send({
            embeds: [
                embedEmbeds.edited(
                    message.author,
                    name
                )
            ]
        });
    }
};
