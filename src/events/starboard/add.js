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

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message =
                reaction.message;

            if (
                !message ||
                !message.guild
            ) {
                return;
            }

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

                const channel =
                    message.guild.channels.cache.get(
                        starboard.channelId
                    );

                if (!channel) {
                    continue;
                }

                const botMember =
                    message.guild.members.me;

                if (!botMember) {

                    console.error(
                        "Starboard error: Bot member could not be found."
                    );

                    continue;
                }

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

                if (
                    count <
                    starboard.threshold
                ) {
                    continue;
                }

                /*
                 * Find the existing Starboard post.
                 *
                 * The original message URL and configured
                 * emoji are both checked so multiple
                 * Starboards can use the same channel.
                 */

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

                /*
                 * Build the Starboard embed.
                 *
                 * The original message author is used
                 * as the embed author.
                 */

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

                /*
                 * Reply information.
                 */

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

                /*
                 * GIF format.
                 *
                 * GIF/image is placed in the thumbnail.
                 */

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

                    } else if (
                        repliedMessage
                    ) {

                        embed.setDescription(
                            gifText
                        );

                    } else {

                        embed.setDescription(
                            gifText
                        );

                    }

                } else if (messageContent) {

                    /*
                     * Normal message text.
                     */

                    embed.setDescription(
                        messageContent
                    );

                }

                /*
                 * Reply line.
                 */

                if (repliedMessage) {

                    const replyText =
                        repliedMessage.content?.trim() ||
                        repliedMessage.attachments.first()?.name ||
                        "Message";

                    embed.addFields({
                        name: "\u200B",
                        value:
                            `<:reply:1551493475940175902> ` +
                            `[${replyText.slice(0, 100)}](${repliedMessage.url})`,
                        inline: false
                    });

                }

                /*
                 * Video / clip format.
                 *
                 * The video itself is sent above the
                 * Starboard embed.
                 */

                if (video) {

                    embed.addFields({
                        name: "\u200B",
                        value:
                            `**#${message.channel.name}**\n` +
                            `[Jump to message](${message.url})`,
                        inline: false
                    });

                } else {

                    /*
                     * Normal source channel information.
                     */

                    embed.addFields({
                        name: "\u200B",
                        value:
                            `**#${message.channel.name}**\n` +
                            `[Jump to message](${message.url})`,
                        inline: false
                    });

                }

                /*
                 * Normal image format.
                 */

                if (
                    image &&
                    !isGif
                ) {

                    embed.setImage(
                        image.url
                    );

                }

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

                        inline: false
                    });

                }

                /*
                 * Native Discord timestamp.
                 */

                embed.setTimestamp(
                    message.createdTimestamp
                );

                /*
                 * Starboard content.
                 *
                 * The number is the current reaction count.
                 */

                const content =
                    `${starboard.emoji} **#${count}**`;

                /*
                 * Existing Starboard post.
                 */

                if (existing) {

                    await existing.edit({
                        content,
                        embeds: [
                            embed
                        ]
                    });

                    continue;
                }

                /*
                 * Video / clip is sent above
                 * the Starboard embed.
                 */

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

                /*
                 * Normal Starboard post.
                 */

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
