const { PermissionFlagsBits } = require("discord.js");

const Starboard = require("../../models/Starboard");
const globalEmbeds = require("../../embeds/global");

module.exports = {

    name: "messageReactionRemove",

    async execute(reaction, user, client) {

        try {

            if (user.bot) return;

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            if (!message.guild) return;

            const starboards = await Starboard.find({
                guildId: message.guild.id
            });

            if (!starboards.length) return;

            for (const starboard of starboards) {

                const reactionEmoji = reaction.emoji.id
                    ? reaction.emoji.id
                    : reaction.emoji.name;

                if (reactionEmoji !== starboard.emoji) {
                    continue;
                }

                const channel =
                    message.guild.channels.cache.get(
                        starboard.channelId
                    );

                if (!channel) continue;

                const permissions =
                    channel.permissionsFor(client.user);

                if (!permissions) continue;

                const required = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const missing = required.filter(
                    permission =>
                        !permissions.has(permission)
                );

                if (missing.length) {

                    console.error(
                        globalEmbeds.botPermission(
                            `<@${client.user.id}>`,
                            missing.map(
                                permission =>
                                    Object.keys(
                                        PermissionFlagsBits
                                    ).find(
                                        key =>
                                            PermissionFlagsBits[key] === permission
                                    ) || "Unknown"
                            )
                        ).data.description
                    );

                    continue;
                }

                const count = reaction.count || 0;

                if (count >= starboard.threshold) {
                    continue;
                }

                // Starboard removal/update will be added
                // after the Starboard embed system is built.

            }

        } catch (error) {

            console.error(
                "Starboard remove event error:",
                error
            );

        }

    }

};
