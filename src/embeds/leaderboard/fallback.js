const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");


module.exports = {

    chat(
        guild,
        entries,
        nextWipeAt
    ) {

        return createChat(
            guild,
            buildChat(entries),
            nextWipeAt
        );

    },


    voice(
        guild,
        entries,
        nextWipeAt
    ) {

        return createVoice(
            guild,
            buildVoice(entries),
            nextWipeAt
        );

    }

};


function createChat(
    guild,
    leaderboard,
    nextWipeAt
) {

    const day =
        new Intl.DateTimeFormat(
            "en-US",
            {
                weekday: "long"
            }
        ).format(
            new Date()
        );


    const embed =
        new EmbedBuilder()
            .setColor(
                config.colors.failed
            )
            .setTitle(
                "💬 Chat Leaderboard"
            )
            .setAuthor({
                name:
                    guild.name
            })
            .setDescription(
                `${leaderboard}\n\n` +
                `${config.emojis.failed} Leaderboard temporarily unavailable. Showing the last saved data.`
            )
            .setFooter({
                text:
                    `Last saved data • ${day} • Next wipe: in ${timeUntil(nextWipeAt)}`
            });


    const icon =
        guild.iconURL({
            dynamic: true,
            size: 4096
        });


    if (icon) {

        embed.setThumbnail(
            icon
        );

    }


    return embed;

}


function createVoice(
    guild,
    leaderboard,
    nextWipeAt
) {

    const embed =
        new EmbedBuilder()
            .setColor(
                config.colors.failed
            )
            .setAuthor({
                name:
                    `<:vc_speaker:1551552443081302066> ${guild.name}'s VC leaderboard`
            })
            .setDescription(
                `${leaderboard}\n\n` +
                `${config.emojis.failed} Leaderboard temporarily unavailable. Showing the last saved data.`
            )
            .setFooter({
                text:
                    "updates every 1 min"
            });


    const icon =
        guild.iconURL({
            dynamic: true,
            size: 4096
        });


    if (icon) {

        embed.setThumbnail(
            icon
        );

    }


    return embed;

}


function buildChat(
    entries
) {

    if (!entries?.length) {
        return "No messages recorded yet.";
    }


    return entries
        .slice(0, 10)
        .map(
            (entry, index) =>
                `${medal(index)} <@${entry.userId}> — **${Number(entry.messages || 0).toLocaleString()}**`
        )
        .join("\n");

}


function buildVoice(
    entries
) {

    if (!entries?.length) {
        return "No voice activity recorded yet.";
    }


    return entries
        .slice(0, 10)
        .map(
            (entry, index) => {

                const member =
                    guildMember(
                        entry.userId
                    );

                const username =
                    member?.user?.username ||
                    "Unknown User";

                const mention =
                    `<@${entry.userId}>`;

                const position =
                    index + 1;

                const positionEmoji =
                    position === 1
                        ? "<:1st:1551552460374413373>"
                        : position === 2
                            ? "<:2nd:1551552475771699240>"
                            : position === 3
                                ? "<:3rd:1551552489021505596>"
                                : `#${position}`;

                return `${positionEmoji} **${username}** (${mention}) — \`${formatVoice(entry.totalSeconds)}\``;

            }
        )
        .join("\n\n");

}


function guildMember(
    userId
) {

    return null;

}


function medal(
    index
) {

    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `${index + 1}.`;

}


function formatVoice(
    seconds
) {

    seconds =
        Math.max(
            0,
            Number(seconds) || 0
        );


    const days =
        Math.floor(
            seconds / 86400
        );

    const hours =
        Math.floor(
            (
                seconds % 86400
            ) / 3600
        );

    const minutes =
        Math.floor(
            (
                seconds % 3600
            ) / 60
        );


    const parts = [];


    if (days > 0) {

        parts.push(
            `${days}d`
        );

    }


    if (
        hours > 0 ||
        days > 0
    ) {

        parts.push(
            `${hours}h`
        );

    }


    parts.push(
        `${minutes}m`
    );


    return parts.join(" ");

}


function timeUntil(
    target
) {

    if (!target) {
        return "unknown";
    }


    const difference =
        new Date(target).getTime() -
        Date.now();


    if (difference <= 0) {
        return "now";
    }


    const days =
        Math.floor(
            difference / 86400000
        );

    const hours =
        Math.floor(
            (
                difference % 86400000
            ) / 3600000
        );

    const minutes =
        Math.floor(
            (
                difference % 3600000
            ) / 60000
        );


    if (days > 0) {
        return `${days}d ${hours}h`;
    }


    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }


    return `${Math.max(
        minutes,
        1
    )}m`;

}
