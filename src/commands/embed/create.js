const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const {
    createSession
} = require("../../systems/embed/builder");

const globalEmbeds =
    require("../../embeds/general/global");

const embed =
    require("../../embeds/general/embed");

module.exports = {

    name: "embed create",

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
                embeds: [
                    embed.channelNotFound(
                        message.author
                    )
                ]
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
        // CREATE SESSION
        // =========================

        const session = createSession(
            message.author.id,
            message.guild.id
        );

        session.data.name = name;
        session.data.channelId = channel.id;

        // =========================
        // EDITOR BUTTONS
        // =========================

        const editorRow =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("embed:content")
                        .setEmoji("📝")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:embed")
                        .setEmoji("🎨")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:field")
                        .setEmoji("📋")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:button")
                        .setEmoji("🔘")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:select")
                        .setEmoji("📑")
                        .setStyle(ButtonStyle.Secondary)
                );

        // =========================
        // CONTROL BUTTONS
        // =========================

        const controlRow =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("embed:preview")
                        .setEmoji("👁️")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("embed:save")
                        .setEmoji("💾")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId("embed:send")
                        .setEmoji("📤")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId("embed:cancel")
                        .setEmoji("🗑️")
                        .setStyle(ButtonStyle.Danger)
                );

        // =========================
        // SEND EMBED TO CHANNEL
        // =========================

        return channel.send({
            embeds: [
                embed.created(
                    message.author,
                    name
                )
            ],
            components: [
                editorRow,
                controlRow
            ]
        });
    }
};
