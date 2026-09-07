const {
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

const starboardEmbeds =
    require("../../embeds/general/starboard");


// =========================
// EMOJI NORMALIZER
// =========================

function normalizeEmoji(emoji) {

    if (!emoji) {
        return null;
    }

    // =========================
    // CUSTOM DISCORD EMOJI
    // =========================

    if (
        typeof emoji === "object" &&
        emoji.id
    ) {

        return `custom:${emoji.id}`;

    }

    if (
        typeof emoji === "string"
    ) {

        const customEmoji =
            emoji.match(
                /^<a?:\w+:(\d+)>$/
            );

        if (customEmoji) {

            return `custom:${customEmoji[1]}`;

        }

        // =========================
        // UNICODE EMOJI
        // =========================

        return `unicode:${emoji
            .normalize("NFC")
            .replace(/\uFE0F/g, "")
            .replace(/\u200D/g, "")
            .trim()}`;
    }

    return null;
}


// =========================
// EVENT
// =========================

module.exports = {

    name: "messageReactionAdd",

    async execute(
        reaction,
        user,
        client
    ) {

        try {

            if (user.bot) {
                return;
            }

            // =========================
            // FETCH PARTIAL REACTION
            // =========================

            if (reaction.partial) {

                await reaction.fetch();

            }

            const message =
                reaction.message;

            if (!message) {
                return;
            }

            if (!message.guild) {
                return;
            }

            // =========================
            // GET STARBOARDS
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
            // REACTION EMOJI
            // =========================

            const reactionEmoji =
                normalizeEmoji(
                    reaction.emoji
                );

            // =========================
            // CHECK STARBOARDS
            // =========================

            for (
                const starboard
                of starboards
            ) {

                const configuredEmoji =
                    normalizeEmoji(
                        starboard.emoji
                    );

                // =========================
                // EMOJI MATCH
                // =========================

                if (
                    reactionEmoji !==
                    configuredEmoji
                ) {
                    continue;
                }

                // =========================
                // CHANNEL
                // =========================

                const channel =
                    message.guild.channels.cache.get(
                        starboard.channelId
                    );

                if (!channel) {
                    continue;
                }

                // =========================
                // PERMISSIONS
                // =========================

                const permissions =
                    channel.permissionsFor(
                        client.user
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
                    requiredPermissions.filter(
                        permission =>
                            !permissions.has(
                                permission
                            )
                    );

                if (
                    missingPermissions.length
                ) {

                    console.error(
                        "Starboard missing permissions:",
                        missingPermissions
                    );

                    continue;
                }

                // =========================
                // FETCH USERS
                // =========================

                let users;

                try {

                    users =
                        await reaction.users.fetch();

                } catch (error) {

                    console.error(
                        "Starboard reaction users error:",
                        error
                    );

                    continue;
                }

                // =========================
                // COUNT
                // =========================

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
                // FIND EXISTING ENTRY
                // =========================

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

                // =========================
                // CREATE EMBED
                // =========================

                const embed =
                    starboardEmbeds.entry(
                        message,
                        starboard.color
                    );

                const content =
                    `${starboard.emoji} ${count}`;

                // =========================
                // UPDATE
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
                // CREATE
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
                "Starboard add event error:",
                error
            );

        }

    }

};
