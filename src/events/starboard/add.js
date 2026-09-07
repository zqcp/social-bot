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

            // Fetch partial reaction
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

                if (!reactionEmoji || !configuredEmoji) {
                    continue;
                }

                // Only handle this Starboard's configured emoji
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

                // Fetch all users who reacted
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

                // Don't count the original message author
                // unless self reactions are enabled.
                if (
                    !starboard.selfReact &&
                    users.has(message.author.id)
                ) {
                    count--;
                }

                if (count < 0) {
                    count = 0;
                }

                // Threshold not reached
                if (count < starboard.threshold) {
                    continue;
                }

                /*
                 * Find the bot's existing Starboard post.
                 *
                 * Use the guild member's ID instead of client.user.id
                 * so we don't depend on client.user being available here.
                 */
                const botMember = message.guild.members.me;

                if (!botMember) {
                    console.error(
                        "Starboard error: Bot member could not be found."
                    );
                    continue;
                }

                const botId = botMember.id;

                const messages = await channel.messages.fetch({
                    limit: 100
                });

                const existing = messages.find(
                    starboardMessage => {
                        if (!starboardMessage.author) {
                            return false;
                        }

                        if (starboardMessage.author.id !== botId) {
                            return false;
                        }

                        return starboardMessage.embeds.some(
                            embed => embed.url === message.url
                        );
                    }
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
