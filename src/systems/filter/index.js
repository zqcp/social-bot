const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const config =
    require("../../config");

const filterConfig =
    require("./config");

const {
    findBlockedWord
} = require("./detector");

const {
    punish
} = require("./actions");

// =========================
// STRIKES
// =========================

const strikes =
    new Map();

// =========================
// FILTER SYSTEM
// =========================

async function handleMessage(
    message,
    filter
) {

    if (
        !message.guild ||
        !message.member
    ) {
        return;
    }

    if (
        filterConfig.ignoreBots &&
        message.author.bot
    ) {
        return;
    }

    if (
        !filter?.enabled ||
        !Array.isArray(filter.words) ||
        !filter.words.length
    ) {
        return;
    }

    // =========================
    // FIND MATCH
    // =========================

    const matchedWord =
        findBlockedWord(
            message.content,
            filter.words
        );

    if (!matchedWord) {
        return;
    }

    // =========================
    // ADMINISTRATOR
    // =========================

    if (
        message.member.permissions.has(
            PermissionFlagsBits.Administrator
        )
    ) {

        if (
            filterConfig.deleteMessage &&
            message.deletable
        ) {
            try {
                await message.delete();
            } catch {}
        }

        return;
    }

    // =========================
    // BYPASS PERMISSIONS
    // =========================

    if (
        filterConfig.bypassPermissions.some(
            permission =>
                message.member.permissions.has(
                    permission
                )
        )
    ) {
        return;
    }

    // =========================
    // DELETE MESSAGE
    // =========================

    if (
        filterConfig.deleteMessage &&
        message.deletable
    ) {
        try {
            await message.delete();
        } catch {}
    }

    // =========================
    // STRIKE
    // =========================

    const key =
        `${message.guild.id}:${message.author.id}`;

    const now =
        Date.now();

    let data =
        strikes.get(key);

    if (
        !data ||
        now - data.lastViolation >=
            filterConfig.strikeReset
    ) {
        data = {
            count: 0,
            lastViolation: 0,
            timeoutUntil: 0
        };
    }

    // =========================
    // ACTIVE TIMEOUT
    // =========================

    if (
        message.member.communicationDisabledUntilTimestamp &&
        message.member.communicationDisabledUntilTimestamp >
            now
    ) {

        data.lastViolation =
            now;

        strikes.set(
            key,
            data
        );

        return;
    }

    // =========================
    // INCREASE STRIKE
    // =========================

    data.count =
        Math.min(
            data.count + 1,
            3
        );

    data.lastViolation =
        now;

    // =========================
    // PUNISH
    // =========================

    const punishment =
        await punish(
            message.member,
            data.count
        );

    if (punishment) {
        data.timeoutUntil =
            now +
            punishment.duration;
    }

    strikes.set(
        key,
        data
    );

    // =========================
    // WARNING
    // =========================

    if (
        !filterConfig.sendWarning ||
        !punishment
    ) {
        return;
    }

    try {

        const warning =
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `⚠️ ${message.author}: Your message was removed because it contained a blocked word. You have been timed out for ${punishment.name}.`
                        )
                ]
            });

        if (
            filterConfig.warningDeleteAfter > 0
        ) {
            setTimeout(
                async () => {

                    try {
                        await warning.delete();
                    } catch {}

                },
                filterConfig.warningDeleteAfter
            );
        }

    } catch {}
}

// =========================
// CLEANUP
// =========================

function cleanupStrikes() {

    const now =
        Date.now();

    for (
        const [
            key,
            data
        ] of strikes
    ) {

        if (
            now - data.lastViolation >=
            filterConfig.strikeReset
        ) {
            strikes.delete(key);
        }
    }
}

// =========================
// INTERVAL
// =========================

setInterval(
    cleanupStrikes,
    60 * 60 * 1000
);

// =========================
// EXPORTS
// =========================

module.exports = {
    handleMessage,
    cleanupStrikes,
    strikes
};
