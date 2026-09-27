const {
    ContainerBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    ThumbnailBuilder
} = require("discord.js");

const config =
    require("../../../config");


function separator() {

    return new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(
            SeparatorSpacingSize.Small
        );

}


function userSection(
    user,
    content
) {

    const section =
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        content || ""
                    )
            );

    if (user) {

        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(
                    user.displayAvatarURL({
                        dynamic: true,
                        size: 256
                    })
                )
        );

    }

    return section;

}


function listSection(
    title,
    items = []
) {

    const content =
        items.length
            ? items
                .map(
                    item =>
                        `• ${item}`
                )
                .join("\n")
            : "None";

    return new TextDisplayBuilder()
        .setContent(
`**${title}**
\`\`\`
${content}
\`\`\``
        );

}


/* =========================================================
   NORMAL CHANNEL EVENT
========================================================= */

function event(
    user,
    action,
    channel,
    changes = [],
    result = "The channel event was recorded successfully.",
    eventId = null
) {

    let title =
        "Channel Event";

    let description =
        `> ${user} performed a channel **${action}** action.`;

    if (
        action === "created"
    ) {

        title =
            "Channel Created";

        description =
            `> ${user} created ${channel}.`;

    }

    if (
        action === "updated"
    ) {

        title =
            "Channel Updated";

        description =
            `> ${user} updated ${channel}.`;

    }

    if (
        action === "deleted"
    ) {

        title =
            "Channel Deleted";

        description =
            `> ${user} deleted ${channel}.`;

    }

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`channel\`
**Action:** \`${action}\`
**Channel:** ${channel}
**Channel ID:** \`${channel.id}\``;

    const changesSection =
        listSection(
            "Changes:",
            changes
        );

    const resultSection =
        new TextDisplayBuilder()
            .setContent(
                `**Result:** ${result}`
            );

    const eventSection =
        new TextDisplayBuilder()
            .setContent(
                `**Event ID:** \`${eventId || "N/A"}\``
            );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## ${title}\n${description}`
                )
        )
        .addSeparatorComponents(
            separator()
        )
        .addSectionComponents(
            userSection(
                user,
                information
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            changesSection
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            resultSection
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            eventSection
        );

}


/* =========================================================
   ANTINUKE TRIGGERED
========================================================= */

function triggered(
    user,
    actions,
    threshold,
    detectedActions = [],
    punishment,
    result,
    channel
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`channel\`
**Channel:** ${channel || "Unknown"}
**Channel ID:** \`${channel?.id || "N/A"}\`

**Activity:** \`${actions} actions\`
**Threshold:** \`${threshold} actions\`
**Punishment:** \`${punishment || "N/A"}\`
**Result:** ${result || "N/A"}`;

    const detectedSection =
        listSection(
            "Detected actions:",
            detectedActions
        );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## AntiNuke Alert\n" +
                    `> ${user} made several destructive changes to the server's channels.`
                )
        )
        .addSeparatorComponents(
            separator()
        )
        .addSectionComponents(
            userSection(
                user,
                information
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            detectedSection
        );

}


/* =========================================================
   CHANNEL RECOVERY
========================================================= */

function recovery(
    user,
    channels = [],
    recoveredActions = [],
    result =
        "The affected channels were successfully restored."
) {

    const channelList =
        channels.length
            ? channels.map(
                channel => {

                    if (
                        typeof channel ===
                        "string"
                    ) {

                        return channel;

                    }

                    return (
                        `${channel.name || "Unknown channel"} ` +
                        `[${channel.id}]`
                    );

                }
            )
            : [];

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`channel\``;

    const recoveredChannels =
        listSection(
            "Recovered channels:",
            channelList
        );

    const recoveredActionsSection =
        listSection(
            "Recovered actions:",
            recoveredActions
        );

    const resultSection =
        new TextDisplayBuilder()
            .setContent(
                `**Result:** ${result}`
            );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## Channels Restored\n" +
                    "> The affected channels were successfully restored."
                )
        )
        .addSeparatorComponents(
            separator()
        )
        .addSectionComponents(
            userSection(
                user,
                information
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            recoveredChannels
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            recoveredActionsSection
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            resultSection
        );

}


/* =========================================================
   CHANNEL PROTECTION FAILED
========================================================= */

function failed(
    user,
    channel,
    failedActions = [],
    result =
        "The affected channels could not be fully restored.",
    action = "restore"
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`channel\`
**Action:** \`${action}\`
**Channel:** ${channel || "Unknown"}
**Channel ID:** \`${channel?.id || "N/A"}\``;

    const failedSection =
        listSection(
            "Failed actions:",
            failedActions
        );

    const resultSection =
        new TextDisplayBuilder()
            .setContent(
                `**Result:** ${result}`
            );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## Channel Protection Failed\n" +
                    `> ${user} made destructive channel changes, but the affected channels could not be fully restored.`
                )
        )
        .addSeparatorComponents(
            separator()
        )
        .addSectionComponents(
            userSection(
                user,
                information
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            failedSection
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            resultSection
        );

}


module.exports = {
    event,
    triggered,
    recovery,
    failed
};
