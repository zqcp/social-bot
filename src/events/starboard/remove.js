const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

module.exports = {

    name: "messageReactionRemove",

    async execute(reaction, user, client) {

        try {

            if (user.bot) return;

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message =
                reaction.message;

            if (!message.guild) return;

            const starboards =
                await Starboard.find({
                    guildId:
                        message.guild.id
                });

            if (!starboards.length) return;

            for (const starboard of starboards) {

                let reactionEmoji =
                    reaction.emoji.name;

                if (reaction.emoji.id) {
                    reactionEmoji =
                        reaction.emoji.id;
                }

                let configuredEmoji =
                    starboard.emoji;

                const customEmoji =
                    configuredEmoji.match(
                        /^<a?:\w+:(\d+)>$/
                    );

                if (customEmoji) {
                    configuredEmoji =
                        customEmoji[1];
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

                    await Starboard.deleteMany({
                        guildId:
                            message.guild.id,
                        channelId:
                            starboard.channelId
                    });

                    continue;
                }

                const permissions =
                    channel.permissionsFor(
                        client.user
                    );

                if (!permissions) continue;

                const required = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const missing =
                    required.filter(
                        permission =>
                            !permissions.has(
                                permission
                            )
                    );

                if (missing.length) {

                    console.error(
                        `Missing Starboard permissions: ${missing.join(", ")}`
                    );

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

                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                const existing =
                    messages.find(
                        starboardMessage => {

                            if (
                                starboardMessage.author?.id !==
                                client.user.id
                            ) {
                                return false;
                            }

                            const embed =
                                starboardMessage.embeds[0];

                            if (!embed) {
                                return false;
                            }

                            if (
                                embed.url !==
                                message.url
                            ) {
                                return false;
                            }

                            return starboardMessage.content
                                ?.startsWith(
                                    starboard.emoji
                                );
                        }
                    );

                if (!existing) continue;

                /*
                 * Remove the Starboard post if the
                 * reaction count falls below threshold.
                 */

                if (
                    count <
                    starboard.threshold
                ) {

                    await existing
                        .delete()
                        .catch(() => {});

                    continue;
                }

                /*
                 * Keep the existing Starboard number.
                 */

                const numberMatch =
                    existing.content?.match(
                        /\*\*#(\d+)\*\*/
                    );

                const starboardNumber =
                    numberMatch
                        ? Number(numberMatch[1])
                        : 1;

                /*
                 * Keep the color already used by
                 * the existing Starboard embed.
                 *
                 * This is important for "random":
                 * the random color is generated when
                 * the post is first created and is
                 * reused when the post is edited.
                 */

                const existingEmbed =
                    existing.embeds[0];

                let color =
                    existingEmbed.color;

                if (!color) {

                    color =
                        typeof starboard.color === "string" &&
                        starboard.color.toLowerCase() !== "random"
                            ? starboard.color
                            : Math.floor(
                                Math.random() *
                                0xFFFFFF
                            );
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            color
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
                        `<t:${Math.floor(
                            message.createdTimestamp / 1000
                        )}:d>`
                });

                await existing.edit({
                    content:
                        `${starboard.emoji} **#${starboardNumber}**`,
                    embeds: [
                        embed
                    ]
                });
            }

        } catch (error) {

            console.error(
                "Starboard remove event error:",
                error
            );

        }

    }

};
