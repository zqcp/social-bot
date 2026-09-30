const {
    PermissionFlagsBits,
    WebhookClient
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

    const webhookUrl =
        antiNuke.logs?.webhookUrl;

    if (!webhookUrl) {
        return;
    }

    const webhook =
        new WebhookClient({
            url: webhookUrl
        });

    if (
        !data?.module ||
        !data.user
    ) {
        webhook.destroy();
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

            webhook.destroy();

            return;

    }

    if (!embed) {
        webhook.destroy();
        return;
    }

    await webhook.send({
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

    webhook.destroy();

}


module.exports = {
    send
};
