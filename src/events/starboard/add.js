const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

const timestamp =
    require("../../utils/timestamp");

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

function getStarboardNumber(content) {

    if (!content) return null;

    const match =
        content.match(/\*\*#(\d+)\*\*/);

    if (!match) return null;

    return Number(match[1]);
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

                const permissions =
                    channel.permissionsFor(
                        message.guild.members.me
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

                const botMember =
                    message.guild.members.me;

                if (!botMember) {

                    console.error(
                        "Starboard error: Bot member could not be found."
                    );

                    continue;
                }

                const botId =
                    botMember.id;

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
                                    botId
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
                 * Existing Starboard posts keep their
                 * original entry number.
                 */

                let starboardNumber;

                if (existing) {

                    starboardNumber =
                        getStarboardNumber(
                            existing.content
                        );

                } else {

                    /*
                     * Find the highest existing Starboard
                     * entry number and use the next number.
                     */

                    let highestNumber = 0;

                    try {

                        const messages =
                            await channel.messages.fetch({
                                limit: 100
                            });

                        for (
                            const starboardMessage
                            of messages.values()
                        ) {

                            if (
                                !starboardMessage.author ||
                                starboardMessage.author.id !==
                                botId
                            ) {
                                continue;
                            }

                            const number =
                                getStarboardNumber(
                                    starboardMessage.content
                                );

                            if (
                                number &&
                                number >
                                highestNumber
                            ) {
                                highestNumber =
                                    number;
                            }
                        }

                    } catch (error) {

                        console.error(
                            "Failed to determine Starboard number:",
                            error
                        );

                        continue;
                    }

                    starboardNumber =
                        highestNumber + 1;
                }

                /*
                 * Fallback for older Starboard posts
                 * that do not contain a number.
                 */

                if (
                    !starboardNumber ||
                    starboardNumber < 1
                ) {
                    starboardNumber = 1;
                }

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

                if (messageContent) {

                    embed.setDescription(
                        messageContent
                    );
                }

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

                embed.addFields({
                    name: "\u200B",
                    value:
                        `**#${message.channel.name}**\n` +
                        `[Jump to message](${message.url})`,
                    inline: false
                });

                if (image) {

                    embed.setImage(
                        image.url
                    );
                }

                const otherAttachments =
                    attachments.filter(
                        attachment =>
                            attachment.id !==
                            image?.id
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

                embed.setFooter({
                    text:
                        timestamp.full(
                            message.createdTimestamp
                        )
                });

                /*
                 * #1, #2, #3...
                 * is the Starboard entry number.
                 *
                 * It is NOT the reaction count.
                 */

                const content =
                    `${starboard.emoji} **#${starboardNumber}**`;

                if (existing) {

                    await existing.edit({
                        content,
                        embeds: [
                            embed
                        ]
                    });

                    continue;
                }

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
