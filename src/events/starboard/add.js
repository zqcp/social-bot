const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

function normalizeEmoji(emoji) {

    if (!emoji) return null;

    if (typeof emoji === "object") {

        if (emoji.id) {
            return `custom:${emoji.id}`;
        }

        if (emoji.name) {
            return normalizeEmoji(emoji.name);
        }

        return null;
    }

    if (typeof emoji === "string") {

        const customEmoji =
            emoji.match(/^<a?:\w+:(\d+)>$/);

        if (customEmoji) {
            return `custom:${customEmoji[1]}`;
        }

        return `unicode:${emoji
            .normalize("NFC")
            .replace(/\uFE0F/g, "")
            .replace(/\u200D/g, "")
            .trim()}`;
    }

    return null;
}

module.exports = {

    name: "messageReactionAdd",

    async execute(
        reaction,
        user,
        client
    ) {

        try {

            if (user.bot) return;

            // =========================
            // FETCH PARTIAL REACTION
            // =========================

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message =
                reaction.message;

            if (!message) {
                return;
            }

            // =========================
            // FETCH PARTIAL MESSAGE
            // =========================

            if (message.partial) {
                await message.fetch();
            }

            if (!message.guild) {
                return;
            }

            // =========================
            // FIND STARBOARDS
            // =========================

            const starboards =
                await Starboard.find({
                    guildId:
                        message.guild.id
                });

            if (!starboards.length) {
                return;
            }

            for (
                const starboard of starboards
            ) {

                // =========================
                // EMOJI CHECK
                // =========================

                const reactionEmoji =
                    normalizeEmoji(
                        reaction.emoji
                    );

                const configuredEmoji =
                    normalizeEmoji(
                        starboard.emoji
                    );

                if (
                    !reactionEmoji ||
                    !configuredEmoji
                ) {
                    continue;
                }

                if (
                    reactionEmoji !==
                    configuredEmoji
                ) {
                    continue;
                }

                // =========================
                // STARBOARD CHANNEL
                // =========================

                const channel =
                    message.guild.channels.cache.get(
                        starboard.channelId
                    );

                if (!channel) {
                    continue;
                }

                // =========================
                // BOT MEMBER
                // =========================

                const botMember =
                    message.guild.members.me;

                if (!botMember) {

                    console.error(
                        "Starboard error: Bot member could not be found."
                    );

                    continue;
                }

                // =========================
                // BOT PERMISSIONS
                // =========================

                const permissions =
                    channel.permissionsFor(
                        botMember
                    );

                if (!permissions) {
                    continue;
                }

                const requiredPermissions = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const missingPermissions =
                    requiredPermissions.some(
                        permission =>
                            !permissions.has(
                                permission
                            )
                    );

                if (missingPermissions) {
                    continue;
                }

                // =========================
                // REACTION USERS
                // =========================

                let users;

                try {

                    users =
                        await reaction.users.fetch();

                } catch (error) {

                    console.error(
                        "Failed to fetch Starboard reaction users:",
                        error
                    );

                    continue;
                }

                let count =
                    users.size;

                if (
                    !starboard.selfReact &&
                    users.has(
                        message.author.id
                    )
                ) {
                    count--;
                }

                if (count < 0) {
                    count = 0;
                }

                // =========================
                // THRESHOLD
                // =========================

                if (
                    count <
                    starboard.threshold
                ) {
                    continue;
                }

                // =========================
                // EXISTING STARBOARD POST
                // =========================

                let existing = null;

                try {

                    const messages =
                        await channel.messages.fetch({
                            limit: 100
                        });

                    existing =
                        messages.find(
                            starboardMessage => {

                                if (
                                    !starboardMessage.author
                                ) {
                                    return false;
                                }

                                if (
                                    starboardMessage.author.id !==
                                    botMember.id
                                ) {
                                    return false;
                                }

                                if (
                                    !starboardMessage.embeds.length
                                ) {
                                    return false;
                                }

                                const matchingEmbed =
                                    starboardMessage.embeds.find(
                                        embed =>
                                            embed.url ===
                                            message.url
                                    );

                                if (!matchingEmbed) {
                                    return false;
                                }

                                return starboardMessage.content
                                    ?.startsWith(
                                        starboard.emoji
                                    );
                            }
                        );

                } catch (error) {

                    console.error(
                        "Failed to fetch Starboard messages:",
                        error
                    );

                    continue;
                }

                // =========================
                // BUILD EMBED
                // =========================

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            starboard.color
                        )
                        .setURL(
                            message.url
                        )
                        .setAuthor({
                            name:
                                message.author.displayName ||
                                message.author.username,

                            iconURL:
                                message.author.displayAvatarURL({
                                    extension: "png",
                                    size: 128
                                })
                        });

                const messageContent =
                    message.content?.trim();

                const attachments =
                    [
                        ...message.attachments.values()
                    ];

                const image =
                    attachments.find(
                        attachment =>
                            attachment.contentType?.startsWith(
                                "image/"
                            )
                    );

                const video =
                    attachments.find(
                        attachment =>
                            attachment.contentType?.startsWith(
                                "video/"
                            )
                    );

                // =========================
                // REPLY
                // =========================

                let repliedMessage = null;

                if (
                    message.reference?.messageId
                ) {

                    repliedMessage =
                        await message.channel.messages
                            .fetch(
                                message.reference.messageId
                            )
                            .catch(
                                () => null
                            );
                }

                // =========================
                // GIF
                // =========================

                const isGif =
                    image?.contentType ===
                        "image/gif" ||
                    image?.name?.toLowerCase().endsWith(
                        ".gif"
                    );

                if (isGif) {

                    embed.setThumbnail(
                        image.url
                    );

                    const gifText =
                        image.name ||
                        "GIF";

                    if (messageContent) {

                        embed.setDescription(
                            messageContent
                        );

                    } else {

                        embed.setDescription(
                            gifText
                        );

                    }

                } else if (messageContent) {

                    embed.setDescription(
                        messageContent
                    );
                }

                // =========================
                // REPLY LINE
                // =========================

                if (repliedMessage) {

                    const replyText =
                        repliedMessage.content?.trim() ||
                        repliedMessage.attachments.first()?.name ||
                        "Message";

                    embed.addFields({
                        name:
                            "\u200B",

                        value:
                            `<:reply:1551493475940175902> ` +
                            `[${replyText.slice(0, 100)}](${repliedMessage.url})`,

                        inline:
                            false
                    });
                }

                // =========================
                // SOURCE CHANNEL
                // =========================

                embed.addFields({
                    name:
                        "\u200B",

                    value:
                        `**#${message.channel.name}**\n` +
                        `[Jump to message](${message.url})`,

                    inline:
                        false
                });

                // =========================
                // IMAGE
                // =========================

                if (
                    image &&
                    !isGif
                ) {

                    embed.setImage(
                        image.url
                    );
                }

                // =========================
                // OTHER ATTACHMENTS
                // =========================

                const otherAttachments =
                    attachments.filter(
                        attachment =>
                            attachment.id !==
                            image?.id &&
                            attachment.id !==
                            video?.id
                    );

                if (
                    otherAttachments.length
                ) {

                    embed.addFields({
                        name:
                            "Attachments",

                        value:
                            otherAttachments
                                .map(
                                    attachment =>
                                        `[${attachment.name || "Attachment"}](${attachment.url})`
                                )
                                .join("\n")
                                .slice(
                                    0,
                                    1024
                                ),

                        inline:
                            false
                    });
                }

                // =========================
                // TIMESTAMP
                // =========================

                embed.setTimestamp(
                    message.createdTimestamp
                );

                // =========================
                // STARBOARD CONTENT
                // =========================

                const content =
                    `${starboard.emoji} **#${count}**`;

                // =========================
                // UPDATE EXISTING
                // =========================

                if (existing) {

                    await existing.edit({
                        content,
                        embeds: [
                            embed
                        ]
                    });

                    continue;
                }

                // =========================
                // VIDEO / CLIP
                // =========================

                if (video) {

                    await channel.send({
                        content:
                            video.url
                    });

                    await channel.send({
                        content,

                        embeds: [
                            embed
                        ]
                    });

                    continue;
                }

                // =========================
                // CREATE STARBOARD POST
                // =========================

                await channel.send({
                    content,

                    embeds: [
                        embed
                    ]
                });
            }

        } catch (error) {

            console.error(
                "Starboard reaction add error:",
                error
            );
        }
    }
};
