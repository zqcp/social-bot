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
                    "**Triggered by**",

                value:
                    `${user}\n` +
                    `\`${user.id}\``,

                inline: true
            },
            {
                name:
                    "**Module**",

                value:
                    "`channel`",

                inline: true
            },
            {
                name:
                    "**Action**",

                value:
                    `\`${action}\``,

                inline: true
            },
            {
                name:
                    "**Channel**",

                value:
                    channel
                        ? `<#${channel.id}>`
                        : "Unknown",

                inline: true
            },
            {
                name:
                    "**Channel ID**",

                value:
                    channel
                        ? `\`${channel.id}\``
                        : "Unknown",

                inline: true
            },
            {
                name:
                    "**Changes**",

                value:
                    changes.length
                        ? changes
                            .map(
                                change =>
                                    `• ${change}`
                            )
                            .join("\n")
                        : "None",

                inline: false
            },
            {
                name:
                    "**Result**",

                value:
                    result,

                inline: false
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
        .addFields({
            name:
                "\u200b",

            value:
`**Triggered by**\u2003\u2003**Module**
${user}\u2003\u2003\u2003\u2003\`channel\`

**Channel**
${channelMention}

**Channel ID**
${channelId}

**Activity**\u2003\u2003**Threshold**
\`${actions} actions\`\u2003\u2003\`${threshold} actions\`

**Punishment**\u2003\u2003**Result**
\`${punishment}\`\u2003\u2003${result}

**Detected actions**
${actionList}`
        })
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
        .addFields({
            name:
                "\u200b",

            value:
`**Triggered by**\u2003\u2003**Module**
${user}\u2003\u2003\u2003\u2003\`channel\`

**Recovered channels**
${channelList}

**Recovered actions**
${actionList}

**Result**
${result}`
        })
        .setTimestamp();

}


module.exports = {
    event,
    triggered,
    recovery
};
