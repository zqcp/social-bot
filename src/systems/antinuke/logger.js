const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const config =
    require("../../config");

async function send(
    guild,
    description
) {

    const antiNuke =
        guild.client.antinukeConfigs?.get(
            guild.id
        );

    const channelId =
        antiNuke?.logs?.channelId;

    if (!channelId) {
        return;
    }

    const channel =
        guild.channels.cache.get(
            channelId
        );

    if (!channel) {
        return;
    }

    const botMember =
        guild.members.me;

    if (!botMember) {
        console.error(
            `[ANTINUKE] Bot member missing in ${guild.id}.`
        );

        return;
    }

    const permissions =
        channel.permissionsFor(
            botMember
        );

    if (
        !permissions?.has(
            PermissionFlagsBits.ViewChannel
        ) ||
        !permissions?.has(
            PermissionFlagsBits.SendMessages
        ) ||
        !permissions?.has(
            PermissionFlagsBits.EmbedLinks
        )
    ) {
        console.error(
            `[ANTINUKE] Missing log channel permissions in ${guild.id}.`
        );

        return;
    }

    const embed =
        new EmbedBuilder()
            .setColor(
                config.colors.failed
            )
            .setDescription(
                description
            )
            .setTimestamp();

    await channel.send({
        embeds: [
            embed
        ]
    }).catch(
        error => {
            console.error(
                "[ANTINUKE LOGGER]",
                error
            );
        }
    );

}

module.exports = {
    send
};
