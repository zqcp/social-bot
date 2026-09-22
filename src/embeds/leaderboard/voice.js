const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    create(guild, entries, nextWipeAt) {

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.colors.regular
                )
                .setTitle(
                    `<:vc_speaker:1551552443081302066> ${guild.name}'s VC leaderboard`
                )
                .setDescription(
                    `-# Resets \`in ${timeUntil(nextWipeAt)}\``
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


        if (!entries?.length) {

            embed.addFields({
                name: "\u200b",
                value:
                    "No voice activity recorded yet.",
                inline: false
            });

            return embed;

        }


        const leaderboard =
            entries
                .slice(0, 10)
                .map((entry, index) => {

                    const position =
                        index + 1;


                    const member =
                        guild.members.cache.get(
                            entry.userId
                        );


                    const username =
                        member?.user?.username ||
                        "Unknown User";


                    const mention =
                        `<@${entry.userId}>`;


                    const positionText =
                        position === 1
                            ? "<:1st:1551552460374413373>"
                            : position === 2
                                ? "<:2nd:1551552475771699240>"
                                : position === 3
                                    ? "<:3rd:1551552489021505596>"
                                    : String(position).padStart(2, "0");


                    return (
                        `${positionText} **${username}** (${mention}) — \`${formatDuration(
                            entry.totalSeconds
                        )}\``
                    );

                })
                .join("\n\n");


        embed.addFields({
            name: "\u200b",
            value:
                leaderboard,
            inline: false
        });


        return embed;

    }

};


function formatDuration(seconds) {

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
            (seconds % 86400) / 3600
        );


    const minutes =
        Math.floor(
            (seconds % 3600) / 60
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


function timeUntil(target) {

    if (!target) {

        return "unknown";

    }


    const difference =
        new Date(target).getTime() -
        Date.now();


    if (difference <= 0) {

        return "now";

    }


    const totalMinutes =
        Math.floor(
            difference / 60000
        );


    const days =
        Math.floor(
            totalMinutes / 1440
        );


    const hours =
        Math.floor(
            (totalMinutes % 1440) / 60
        );


    const minutes =
        totalMinutes % 60;


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


    if (
        minutes > 0 ||
        parts.length === 0
    ) {

        parts.push(
            `${minutes}m`
        );

    }


    return parts.join(" ");

}
