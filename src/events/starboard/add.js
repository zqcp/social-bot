const {
    PermissionFlagsBits
} = require("discord.js");

const Starboard =
    require("../../models/Starboard");

const starboardEmbeds =
    require("../../embeds/general/starboard");

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

            if (!message) return;

            if (!message.guild) return;

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
            // CHECK EACH STARBOARD
            // =========================

            for (
                const starboard
                of starboards
            ) {

                // =========================
                // NORMALIZE REACTION EMOJI
                // =========================

                let reactionEmoji;

                if (reaction.emoji.id) {

                    reactionEmoji =
                        reaction.emoji.id;

                } else {

                    reactionEmoji =
                        reaction.emoji.name;

                }

                // =========================
                // NORMALIZE CONFIGURED EMOJI
                // =========================

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

                // =========================
                // EMOJI DOES NOT MATCH
                // =========================

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

                // =========================
                // BOT PERMISSIONS
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
                        `Starboard is missing permissions in ${channel.id}:`,
                        missingPermissions
                    );

                    continue;
                }

                // =========================
                // FETCH REACTION USERS
                // =========================

                let reactionUsers;

                try {

                    reactionUsers =
                        await reaction.users.fetch();

                } catch (error) {

                    console.error(
                        "Starboard Reaction Users Error:",
                        error
                    );

                    continue;
                }

                // =========================
                // CALCULATE VALID COUNT
                // =========================

                let count =
                    reactionUsers.size;

                // The message author cannot count
                // their own reaction when selfReact
                // is disabled.

                if (
                    starboard.selfReact === false &&
                    reactionUsers.has(
                        message.author.id
                    )
                ) {

                    count--;

                }

                // Never allow a negative count.

                if (count < 0) {
                    count = 0;
                }

                // =========================
                // THRESHOLD CHECK
                // =========================

                if (
                    count <
                    starboard.threshold
                ) {

                    continue;
                }

                // =========================
                // FIND EXISTING STARBOARD
                // =========================

                let existing = null;

                try {

                    const messages =
                        await channel.messages.fetch({
                            limit: 100
                        });

                    existing =
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

                } catch (error) {

                    console.error(
                        "Starboard Message Fetch Error:",
                        error
                    );

                    continue;
                }

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
                // CREATE STARBOARD ENTRY
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
