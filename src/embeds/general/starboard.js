const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    // =========================
    // CREATED
    // =========================

    created(
        user,
        channel
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Starboard has been **created** in ${channel}.`
            );

    },


    // =========================
    // REMOVED
    // =========================

    removed(
        user,
        channel
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Starboard has been **removed** from ${channel}.`
            );

    },


    // =========================
    // CLEARED
    // =========================

    cleared(
        user,
        channel
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Starboard entries in ${channel} have been **cleared**.`
            );

    },


    // =========================
    // ALREADY EXISTS
    // =========================

    alreadyExists(
        user,
        channel
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: A Starboard in ${channel} **already exists**.`
            );

    },


    // =========================
    // NOT FOUND
    // =========================

    notFound(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find that **Starboard**.`
            );

    },


    // =========================
    // NO CHANNEL
    // =========================

    noChannel(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide a **channel**.`
            );

    },


    // =========================
    // NO EMOJI
    // =========================

    noEmoji(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide an **emoji**.`
            );

    },


    // =========================
    // NO COLOR
    // =========================

    noColor(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide a **color**.`
            );

    },


    // =========================
    // NO THRESHOLD
    // =========================

    noThreshold(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide a **reaction threshold**.`
            );

    },


    // =========================
    // NO SELF REACT
    // =========================

    noSelfReact(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to specify whether **self reactions** are allowed.`
            );

    },


    // =========================
    // INVALID COLOR
    // =========================

    invalidColor(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: That **color** is invalid. Use a hex color or \`random\`.`
            );

    },


    // =========================
    // INVALID THRESHOLD
    // =========================

    invalidThreshold(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: The reaction threshold must be a **number greater than 0**.`
            );

    },


    // =========================
    // INVALID SELF REACT
    // =========================

    invalidSelfReact(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Self react must be \`yes\` or \`no\`.`
            );

    },


    // =========================
    // INVALID EMOJI
    // =========================

    invalidEmoji(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: That **emoji** is invalid.`
            );

    },


    // =========================
    // NO STARBOARDS
    // =========================

    noStarboards(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: There are no **configured Starboards**.`
            );

    },


    // =========================
    // FAILED
    // =========================

    failed(
        user,
        action
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Something went wrong while **${action}** the Starboard.`
            );

    },


    // =========================
    // STARBOARD ENTRY
    // =========================

    entry(
        message,
        color
    ) {

        const embed =
            new EmbedBuilder()
                .setColor(
                    color
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

        const content =
            message.content?.trim();

        // =========================
        // MESSAGE CONTENT
        // =========================

        if (content) {

            embed.setDescription(
                content
            );

        }

        // =========================
        // IMAGE
        // =========================

        const attachments =
            [...message.attachments.values()];

        const image =
            attachments.find(
                attachment =>
                    attachment.contentType?.startsWith(
                        "image/"
                    )
            );

        if (image) {

            embed.setImage(
                image.url
            );

        }

        // =========================
        // CHANNEL + JUMP
        // =========================

        embed.addFields({
            name: "\u200B",
            value:
                `**${message.channel.name}**\n` +
                `[Jump to message](${message.url})`,
            inline: false
        });

        // =========================
        // OTHER ATTACHMENTS
        // =========================

        const otherAttachments =
            attachments.filter(
                attachment =>
                    attachment.id !== image?.id
            );

        if (otherAttachments.length) {

            embed.addFields({
                name: "Attachments",
                value:
                    otherAttachments
                        .map(
                            attachment =>
                                `[${attachment.name || "Attachment"}](${attachment.url})`
                        )
                        .join("\n")
                        .slice(0, 1024),
                inline: false
            });

        }

        // =========================
        // FOOTER
        // =========================

        embed.setFooter({
            text:
                new Date(
                    message.createdTimestamp
                ).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                })
        });

        return embed;

    }

};
