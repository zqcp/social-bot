const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const config =
    require("../../config");

const filterConfig =
    require("./config");

const blockedWords =
    require("./blockedWords");

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
// FILTER WORDS
// =========================

function getFilterWords(filter) {

    const words = [];

    // =========================
    // PREMADE WORDS
    // =========================

    if (filter.premade === true) {

        const disabledPremade =
            Array.isArray(filter.disabledPremade)
                ? filter.disabledPremade
                : [];

        for (const word of blockedWords) {

            const disabled =
                disabledPremade.some(
                    disabledWord =>
                        disabledWord.toLowerCase() ===
                        word.toLowerCase()
                );

            if (!disabled) {
                words.push(word);
            }
        }
    }

    // =========================
    // CUSTOM WORDS
    // =========================

    if (Array.isArray(filter.words)) {
        words.push(
            ...filter.words
        );
    }

    // =========================
    // REMOVE DUPLICATES
    // =========================

    return [
        ...new Set(
            words
                .filter(
                    word =>
                        typeof word === "string" &&
                        word.trim()
                )
                .map(
                    word =>
                        word.trim()
                )
        )
    ];
}

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

    if (!filter?.enabled) {
        return;
    }

    const words =
        getFilterWords(filter);

    if (!words.length) {
        return;
    }

    // =========================
    // FIND MATCH
    // =========================

    const matchedWord =
        findBlockedWord(
            message.content,
            words
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
                            `${config.emojis.error} ${message.author}: Message deleted. Timeout: **${punishment.name}**.`
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
    strikes,
    getFilterWords
};
