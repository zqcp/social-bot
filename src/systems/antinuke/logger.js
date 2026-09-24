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

    if (!guild) {
        return;
    }

    const AntiNuke =
        require("../../models/AntiNuke");

    const antiNuke =
        await AntiNuke.findOne({
            guildId:
                guild.id
        }).catch(
            error => {

                console.error(
                    "[ANTINUKE LOGGER]",
                    error
                );

                return null;

            }
        );

    if (!antiNuke) {
        return;
    }

    if (
        antiNuke.logs?.enabled === false
    ) {
        return;
    }

    const channelId =
        antiNuke.logs?.channelId;

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
            `[ANTINUKE LOGGER] Bot member missing in ${guild.id}.`
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
        )
    ) {

        console.error(
            `[ANTINUKE LOGGER] Missing ViewChannel in ${guild.id}.`
        );

        return;

    }

    if (
        !permissions.has(
            PermissionFlagsBits.SendMessages
        )
    ) {

        console.error(
            `[ANTINUKE LOGGER] Missing SendMessages in ${guild.id}.`
        );

        return;

    }

    if (
        !permissions.has(
            PermissionFlagsBits.EmbedLinks
        )
    ) {

        console.error(
            `[ANTINUKE LOGGER] Missing EmbedLinks in ${guild.id}.`
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
