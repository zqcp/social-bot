const {
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

const globalEmbeds =
    require("../../embeds/general/global");

module.exports = {

    name: "messageDelete",

    async execute(message, client) {

        try {

            if (!message.guild) return;

            const starboards =
                await Starboard.find({
                    guildId:
                        message.guild.id
                });

            if (!starboards.length) return;

            for (
                const starboard
                of starboards
            ) {

                const channel =
                    message.guild.channels.cache.get(
                        starboard.channelId
                    );

                /*
                 * If the configured Starboard channel
                 * no longer exists, remove its configuration.
                 */

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
                        globalEmbeds.botPermission(
                            `<@${client.user.id}>`,
                            missing.map(
                                permission =>
                                    Object.keys(
                                        PermissionFlagsBits
                                    ).find(
                                        key =>
                                            PermissionFlagsBits[key] ===
                                            permission
                                    ) || "Unknown"
                            )
                        ).data.description
                    );

                    continue;
                }

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
                            client.user.id
                    ) {
                        continue;
                    }

                    const embed =
                        starboardMessage.embeds[0];

                    if (!embed) continue;

                    const sourceUrl =
                        embed.url;

                    if (!sourceUrl) continue;

                    if (
                        sourceUrl ===
                        message.url
                    ) {

                        await starboardMessage
                            .delete()
                            .catch(() => {});

                    }

                }

            }

        } catch (error) {

            console.error(
                "Starboard delete event error:",
                error
            );

        }

    }
};
