const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");


module.exports = {

    create(
        guild,
        entries,
        nextWipeAt
    ) {

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.colors.regular
                )
                .setTitle(
                    `<:text_icon:1551882289116618814> ${guild.name}'s Chat leaderboard`
                )
                .setDescription(
                    `-# Resets \`in ${timeUntil(nextWipeAt)}\`\n`
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
                    "No messages recorded yet.",
                inline: false
            });

            return embed;

        }


        const leaderboard =
            entries
                .slice(0, 10)
                .map(
                    (entry, index) => {

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
                                        : `\`${String(
                                            position
                                        ).padStart(
                                            2,
                                            "0"
                                        )}\``;


                        return (
                            `${positionText} **${username}** (${mention}) — \`${Number(
                                entry.messages || 0
                            ).toLocaleString()} msgs\``
                        );

                    }
                )
                .join(
                    "\n\n"
                );


        embed.addFields({
            name: "\u200b",
            value:
                `\n${leaderboard}`,
            inline: false
        });


        return embed;

    }

};


function timeUntil(
    target
) {

    if (!target) {

        return "unknown";

    }


    const difference =
        new Date(target).getTime() -
        Date.now();


    if (
        difference <= 0
    ) {

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
            (
                totalMinutes % 1440
            ) / 60
        );


    const minutes =
        totalMinutes % 60;


    const parts = [];


    if (
        days > 0
    ) {

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


    return parts.join(
        " "
    );

}
