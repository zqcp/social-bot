const {
    PermissionFlagsBits
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

                if (!channel) continue;

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

                const count =
                    reaction.count || 0;

                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                const existing =
                    messages.find(
                        starboardMessage =>
                            starboardMessage.author?.id ===
                                client.user.id &&
                            starboardMessage.embeds.some(
                                embed =>
                                    embed.url ===
                                    message.url
                            )
                    );

                if (!existing) continue;

                if (
                    count <
                    starboard.threshold
                ) {

                    await existing.delete()
                        .catch(() => {});

                    continue;
                }

                const embed =
                    require("../../embeds/general/starboard")
                        .entry(
                            message,
                            starboard.color
                        );

                await existing.edit({
                    content:
                        `${starboard.emoji} ${count}`,
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
