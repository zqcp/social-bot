const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

// =========================
// PUNISHMENTS
// =========================

async function punish(
    message,
    type
) {

    if (!message?.guild) {
        return;
    }

    const member =
        message.member;

    if (!member) {
        return;
    }

    // =========================
    // BAN
    // =========================

    const banTypes = [
        "gore",
        "illegal",
        "nazi",
        "terrorist"
    ];

    if (banTypes.includes(type)) {

        try {

            await member.ban({
                reason:
                    `Posting prohibited ${type} content.`
            });

        } catch (error) {

            console.error(
                "Image Moderation Ban Error:",
                error
            );

            return;
        }

        // =========================
        // BAN EMBED
        // =========================

        try {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.success
                    )
                    .setDescription(
                        `${config.emojis.success} Banned **${member.user.username}** for posting prohibited ||${getDisplayType(type)}|| content.`
                    );

            await message.channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {

            console.error(
                "Image Moderation Ban Message Error:",
                error
            );

        }

        return;
    }

    // =========================
    // TIMEOUT
    // =========================

    const timeoutTypes = [
        "nsfw",
        "self-harm"
    ];

    if (timeoutTypes.includes(type)) {

        try {

            await member.timeout(
                10 * 60 * 1000,
                `Posting prohibited ${type} content.`
            );

        } catch (error) {

            console.error(
                "Image Moderation Timeout Error:",
                error
            );

            return;
        }

        // =========================
        // TIMEOUT EMBED
        // =========================

        try {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.success
                    )
                    .setDescription(
                        `${config.emojis.success} Timed out **${member.user.username}** for 10 minutes for posting prohibited ||${getDisplayType(type)}|| content.`
                    );

            await message.channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {

            console.error(
                "Image Moderation Timeout Message Error:",
                error
            );

        }

    }

}

// =========================
// DISPLAY TYPE
// =========================

function getDisplayType(
    type
) {

    const names = {
        gore: "g*re",
        illegal: "illegal",
        nazi: "N*zi",
        terrorist: "terrorist",
        nsfw: "NSFW",
        "self-harm": "self-harm"
    };

    return (
        names[type] ||
        type
    );

}

module.exports = {
    punish
};
