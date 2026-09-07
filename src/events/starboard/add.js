const { PermissionFlagsBits } = require("discord.js");
const Starboard = require("../../models/Starboard");
const starboardEmbeds = require("../../embeds/general/starboard");

function normalizeEmoji(emoji) {
    if (!emoji) return null;

    if (typeof emoji === "object" && emoji.id) {
        return `custom:${emoji.id}`;
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
            console.log("⭐ Starboard reaction event fired");

            if (user.bot) {
                console.log("❌ User is a bot");
                return;
            }

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            if (!message || !message.guild) {
                console.log("❌ Reaction message or guild missing");
                return;
            }

            console.log("📩 Message:", message.id);
            console.log("🏠 Guild:", message.guild.id);
            console.log("😀 Reaction:", reaction.emoji.toString());

            const starboards = await Starboard.find({
                guildId: message.guild.id
            });

            console.log("📋 Starboards found:", starboards.length);

            if (!starboards.length) {
                console.log("❌ No Starboard configuration found");
                return;
            }

            for (const starboard of starboards) {
                console.log("━━━━━━━━━━━━━━━━━━━━");
                console.log("⭐ Checking Starboard:", starboard.channelId);
                console.log("Configured emoji:", starboard.emoji);
                console.log("Reaction emoji:", reaction.emoji.toString());
                console.log("Threshold:", starboard.threshold);
                console.log("Self react:", starboard.selfReact);

                const reactionEmoji = normalizeEmoji(reaction.emoji);
                const configuredEmoji = normalizeEmoji(starboard.emoji);

                console.log("Normalized reaction:", reactionEmoji);
                console.log("Normalized config:", configuredEmoji);

                if (reactionEmoji !== configuredEmoji) {
                    console.log("❌ Emoji does not match");
                    continue;
                }

                console.log("✅ Emoji matches");

                const channel = message.guild.channels.cache.get(
                    starboard.channelId
                );

                if (!channel) {
                    console.log("❌ Starboard channel not found");
                    continue;
                }

                console.log("✅ Starboard channel found:", channel.id);

                const permissions = channel.permissionsFor(client.user);

                if (!permissions) {
                    console.log("❌ Could not check bot permissions");
                    continue;
                }

                const requiredPermissions = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const missingPermissions = requiredPermissions.filter(
                    permission => !permissions.has(permission)
                );

                if (missingPermissions.length) {
                    console.log(
                        "❌ Missing permissions:",
                        missingPermissions.map(permission => permission.toString())
                    );
                    continue;
                }

                console.log("✅ Starboard channel permissions are good");

                let users;

                try {
                    users = await reaction.users.fetch();
                } catch (error) {
                    console.error("❌ Failed to fetch reaction users:", error);
                    continue;
                }

                let count = users.size;

                if (
                    !starboard.selfReact &&
                    users.has(message.author.id)
                ) {
                    count--;
                }

                if (count < 0) count = 0;

                console.log("👥 Reaction count:", count);
                console.log("🎯 Required:", starboard.threshold);

                if (count < starboard.threshold) {
                    console.log("❌ Threshold not reached");
                    continue;
                }

                console.log("✅ Threshold reached");

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

                if (existing) {
                    console.log("🔄 Updating existing Starboard message");

                    await existing.edit({
                        content,
                        embeds: [embed]
                    });

                    console.log("✅ Starboard message updated");
                    continue;
                }

                console.log("📤 Sending Starboard embed...");

                await channel.send({
                    content,
                    embeds: [embed]
                });

                console.log("✅ Starboard embed sent");
            }
        } catch (error) {
            console.error("❌ Starboard add event error:", error);
        }
    }
};
