const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../../config");


function event(
    user,
    action,
    channel,
    changes = [],
    result = "Channel event detected."
) {

    let description =
        `Detected a channel **${action}** event performed by ${user}.`;

    if (
        action === "created"
    ) {

        description =
            `Detected a new channel being **created** by ${user}.`;

    }

    if (
        action === "updated"
    ) {

        description =
            `Detected a channel **update** performed by ${user}.`;

    }

    if (
        action === "deleted"
    ) {

        description =
            `Detected a channel being **deleted** by ${user}.`;

    }

    const channelMention =
        channel
            ? `<#${channel.id}>`
            : "Unknown";

    const channelId =
        channel
            ? `\`${channel.id}\``
            : "Unknown";

    const changeList =
        changes.length
            ? changes
                .map(
                    change =>
                        `• ${change}`
                )
                .join("\n")
            : "None";

    return new EmbedBuilder()
        .setColor(
            "#FFFFFF"
        )
        .setAuthor({
            name:
                user.username,

            iconURL:
                user.displayAvatarURL({
                    dynamic: true
                })
        })
        .setTitle(
            "AntiNuke Channel Event"
        )
        .setDescription(
            description
        )
        .addFields(
            {
                name:
                    "\u200b",

                value:
`**Triggered by**\u2003\u2003**Module**\u2003\u2003**Action**
${user}\u2003\u2003\u2003\u2003\`channel\`\u2003\u2003\`${action}\``
            },
            {
                name:
                    "\u200b",

                value:
`**Channel**
${channelMention}`
            },
            {
                name:
                    "\u200b",

                value:
`**Channel ID**
${channelId}`
            },
            {
                name:
                    "\u200b",

                value:
`**Changes**
${changeList}`
            },
            {
                name:
                    "\u200b",

                value:
`**Result**
${result}`
            }
        )
        .setTimestamp();

}


function triggered(
    user,
    actions,
    threshold,
    detectedActions = [],
    punishment,
    result,
    channel
) {

    const channelMention =
        channel
            ? `<#${channel.id}>`
            : "Unknown";

    const channelId =
        channel
            ? `\`${channel.id}\``
            : "Unknown";

    const actionList =
        detectedActions.length
            ? detectedActions
                .map(
                    action =>
                        `• ${action}`
                )
                .join("\n")
            : "None";

    return new EmbedBuilder()
        .setColor(
            "#FFFFFF"
        )
        .setAuthor({
            name:
                user.username,

            iconURL:
                user.displayAvatarURL({
                    dynamic: true
                })
        })
        .setTitle(
            "AntiNuke Triggered"
        )
        .setDescription(
            `Detected destructive channel activity from ${user}.`
        )
        .addFields(
            {
                name:
                    "\u200b",

                value:
`**Triggered by**\u2003\u2003**Module**
${user}\u2003\u2003\u2003\u2003\`channel\``
            },
            {
                name:
                    "\u200b",

                value:
`**Channel**
${channelMention}`
            },
            {
                name:
                    "\u200b",

                value:
`**Channel ID**
${channelId}`
            },
            {
                name:
                    "\u200b",

                value:
`**Activity**\u2003\u2003**Threshold**
\`${actions} actions\`\u2003\u2003\`${threshold} actions\``
            },
            {
                name:
                    "\u200b",

                value:
`**Punishment**\u2003\u2003**Result**
\`${punishment}\`\u2003\u2003${result}`
            },
            {
                name:
                    "\u200b",

                value:
`**Detected actions**
${actionList}`
            }
        )
        .setTimestamp();

}


function recovery(
    user,
    channels = [],
    recoveredActions = [],
    result = "Channel recovery completed."
) {

    const channelList =
        channels.length
            ? channels
                .map(
                    channel => {

                        if (
                            typeof channel ===
                            "string"
                        ) {

                            return `• ${channel}`;

                        }

                        return (
                            `• ${channel.name || "Unknown channel"} ` +
                            `(\`${channel.id}\`)`
                        );

                    }
                )
                .join("\n")
            : "None";

    const actionList =
        recoveredActions.length
            ? recoveredActions
                .map(
                    action =>
                        `• ${action}`
                )
                .join("\n")
            : "None";

    return new EmbedBuilder()
        .setColor(
            "#FFFFFF"
        )
        .setAuthor({
            name:
                user.username,

            iconURL:
                user.displayAvatarURL({
                    dynamic: true
                })
        })
        .setTitle(
            "AntiNuke Recovery"
        )
        .setDescription(
            "Successfully recovered the affected channels."
        )
        .addFields(
            {
                name:
                    "\u200b",

                value:
`**Triggered by**\u2003\u2003**Module**
${user}\u2003\u2003\u2003\u2003\`channel\``
            },
            {
                name:
                    "\u200b",

                value:
`**Recovered channels**
${channelList}`
            },
            {
                name:
                    "\u200b",

                value:
`**Recovered actions**
${actionList}`
            },
            {
                name:
                    "\u200b",

                value:
`**Result**
${result}`
            }
        )
        .setTimestamp();

}


module.exports = {
    event,
    triggered,
    recovery
};
