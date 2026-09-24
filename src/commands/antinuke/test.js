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
                    `${channel}`,

                inline: true
            },
            {
                name:
                    "**Channel ID**",

                value:
                    `\`${channel.id}\``,

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
    result
) {

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
        .setTitle(
            "AntiNuke Triggered"
        )
        .setDescription(
            "Destructive channel activity detected."
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
                    "**Channel**",

                value:
                    detectedActions.length
                        ? detectedActions[0]
                        : "Unknown",

                inline: true
            },
            {
                name:
                    "**Channel ID**",

                value:
                    `\`${user.id}\``,

                inline: true
            },
            {
                name:
                    "**Activity**",

                value:
                    `\`${actions} actions\``,

                inline: true
            },
            {
                name:
                    "**Threshold**",

                value:
                    `\`${threshold} actions\``,

                inline: true
            },
            {
                name:
                    "**Punishment**",

                value:
                    `\`${punishment}\``,

                inline: true
            },
            {
                name:
                    "**Result**",

                value:
                    result,

                inline: true
            },
            {
                name:
                    "**Detected actions**",

                value:
                    actionList,

                inline: false
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
        .setTitle(
            "AntiNuke Recovery"
        )
        .setDescription(
            `successfully recovered the affected channels after the \`channel\` protection was triggered.`
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
                    "**Recovered channels**",

                value:
                    channelList,

                inline: false
            },
            {
                name:
                    "**Recovered actions**",

                value:
                    actionList,

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


module.exports = {
    event,
    triggered,
    recovery
};
