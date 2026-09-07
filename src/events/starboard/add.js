const { PermissionFlagsBits } = require("discord.js");
const Starboard = require("../../models/Starboard");
const starboardEmbeds = require("../../embeds/general/starboard");

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
        const customEmoji = emoji.match(/^<a?:\w+:(\d+)>$/);

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

    async execute(reaction, user, client) {
        try {
            if (user.bot) return;

            // Fetch partial reaction/message if necessary
            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            if (!message || !message.guild) return;

            const starboards = await Starboard.find({
                guildId: message.guild.id
            });

            if (!starboards.length) return;

            for (const starboard of starboards) {
                const reactionEmoji = normalizeEmoji(reaction.emoji);
                const configuredEmoji = normalizeEmoji(starboard.emoji);

                if (!reactionEmoji || !configuredEmoji) continue;

                // Only handle the configured emoji
                if (reactionEmoji !== configuredEmoji) {
                    continue;
                }

                const channel = message.guild.channels.cache.get(
                    starboard.channelId
                );

                if (!channel) continue;

                const permissions = channel.permissionsFor(
                    message.guild.members.me
                );

                if (!permissions) continue;

                const requiredPermissions = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const missingPermissions = requiredPermissions.some(
                    permission => !permissions.has(permission)
                );

                if (missingPermissions) continue;

                // Get everyone who reacted
                let users;

                try {
                    users = await reaction.users.fetch();
                } catch (error) {
                    console.error(
                        "Failed to fetch Starboard reaction users:",
                        error
                    );
                    continue;
                }

                let count = users.size;

                // Don't count the message author unless self reactions
                // are enabled.
                if (
                    !starboard.selfReact &&
                    users.has(message.author.id)
                ) {
                    count--;
                }

                if (count < 0) count = 0;

                // Threshold has not been reached
                if (count < starboard.threshold) {
                    continue;
                }

                // Look for an existing Starboard post.
                //
                // We identify it by:
                // 1. Being sent by this bot
                // 2. The embed URL matching the original message URL
                const messages = await channel.messages.fetch({
                    limit: 100
                });

                const existing = messages.find(
                    starboardMessage =>
                        starboardMessage.author?.id === client.user.id &&
                        starboardMessage.embeds.some(
                            embed => embed.url === message.url
                        )
                );

                const embed = starboardEmbeds.entry(
                    message,
                    starboard.color
                );

                const content = `${starboard.emoji} ${count}`;

                // Update existing Starboard post
                if (existing) {
                    await existing.edit({
                        content,
                        embeds: [embed]
                    });

                    continue;
                }

                // Create new Starboard post
                await channel.send({
                    content,
                    embeds: [embed]
                });
            }
        } catch (error) {
            console.error("Starboard reaction add error:", error);
        }
    }
};
