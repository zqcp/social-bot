const {
    PermissionFlagsBits
} = require("discord.js");

const builder =
    require("../../systems/embed/builder");

const globalEmbeds =
    require("../../embeds/general/global");

const embedEmbeds =
    require("../../embeds/general/embed");


// ============================================================
// CREATE
// ============================================================

module.exports = {
    name: "embed create",

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
        // CREATE SESSION
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
        // SESSION DATA
        // ======================================================

        session.data.name =
            name;

        session.data.guildId =
            message.guild.id;

        session.data.channelId =
            message.channel.id;

        session.data.content =
            "";

        session.data.embeds =
            [];

        session.data.buttons =
            [];

        session.data.selectMenus =
            [];

        session.data.activeEmbed =
            0;

        session.data.activeField =
            0;

        session.data.activeButton =
            0;

        session.data.activeSelectMenu =
            0;

        session.data.mode =
            "create";

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
