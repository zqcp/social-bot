const {
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

const starboardEmbeds =
    require("../../embeds/general/starboard");

module.exports = {

    name: "messageReactionAdd",

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

                let reactionEmoji;

                if (reaction.emoji.id) {
                    reactionEmoji =
                        reaction.emoji.id;
                } else {
                    reactionEmoji =
                        reaction.emoji.name;
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

                if (
                    starboard.selfReact === false &&
                    message.author?.id === user.id
                ) {
                    return;
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

                if (
                    count <
                    starboard.threshold
                ) {
                    continue;
                }

                const messages =
                    await channel.messages.fetch({
                        limit: 100
                    });

                const existing =
                    messages.find(
                        starboardMessage =>
                            starboardMessage.author.id ===
                                client.user.id &&
                            starboardMessage.embeds.some(
                                embed =>
                                    embed.url ===
                                    message.url
                            )
                    );

                const embed =
                    starboardEmbeds.entry(
                        message,
                        starboard.color
                    );

                const content =
                    `${starboard.emoji} ${count}`;

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
                "Starboard add event error:",
                error
            );

        }

    }

};
