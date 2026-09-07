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

            if (
                !message ||
                !message.guild
            ) {
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

            // =========================
            // CHECK EACH STARBOARD
            // =========================

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
                // BOT ID
                // =========================

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

                // =========================
                // FIND EXISTING ENTRY
                // =========================

                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                const existing =
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

                            return starboardMessage.embeds.some(
                                embed =>
                                    embed.url ===
                                    message.url
                            );

                        }
                    );

                // =========================
                // STARBOARD EMBED
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

                // =========================
                // MESSAGE CONTENT
                // =========================

                const messageContent =
                    message.content?.trim();

                if (messageContent) {

                    embed.setDescription(
                        messageContent
                    );

                }

                // =========================
                // ATTACHMENTS
                // =========================

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

                // =========================
                // CHANNEL + JUMP + TIMESTAMP
                // =========================

                embed.addFields({
                    name: "\u200B",
                    value:
                        `**#${message.channel.name}**\n` +
                        `[Jump to message](${message.url})\n\n` +
                        `**${timestamp.full(
                            message.createdTimestamp
                        )}**`,
                    inline: false
                });

                // =========================
                // IMAGE
                // =========================

                if (image) {

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
                // CREATE ENTRY
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
