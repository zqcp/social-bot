const {
    PermissionFlagsBits
} = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const logs =
    require("../../embeds/antinuke/logs");


async function send(
    guild,
    data
) {

    if (!guild) {
        return;
    }

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

    if (
        !data?.module ||
        !data.user
    ) {
        return;
    }

    let embed = null;

    switch (
        data.module
    ) {

        case "ban":

            embed =
                logs.ban(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.bannedMembers || [],
                    data.punishment,
                    data.result
                );

            break;

        case "kick":

            embed =
                logs.kick(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.kickedMembers || [],
                    data.punishment,
                    data.result
                );

            break;

        case "channel":

            embed =
                logs.channel(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedActions || [],
                    data.punishment,
                    data.result,
                    data.target
                );

            break;

        case "role":

            embed =
                logs.role(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedActions || [],
                    data.punishment,
                    data.result
                );

            break;

        case "emoji":

            embed =
                logs.emoji(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedActions || [],
                    data.punishment,
                    data.result
                );

            break;

        case "botadd":

            embed =
                logs.botadd(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.addedBots || [],
                    data.punishment,
                    data.result
                );

            break;

        case "webhook":

            embed =
                logs.webhook(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedActions || [],
                    data.punishment,
                    data.result
                );

            break;

        case "vanity":

            embed =
                logs.vanity(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedChanges || [],
                    data.punishment,
                    data.result
                );

            break;

        case "permissions":

            embed =
                logs.permissions(
                    data.user,
                    data.actions,
                    data.threshold,
                    data.detectedChanges || [],
                    data.punishment,
                    data.result
                );

            break;

        default:
            return;

    }

    if (!embed) {
        return;
    }

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
