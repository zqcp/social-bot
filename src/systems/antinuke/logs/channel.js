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

    if (
        user
    ) {

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


function event(
    user,
    action,
    channel,
    changes = [],
    result = "The channel was updated.",
    eventId = null
) {

    let title =
        "Channel Updated";

    let description =
        `> ${user} updated ${channel}.`;

    if (
        action === "created"
    ) {

        title =
            "Channel Created";

        description =
            `> ${user} created ${channel}.`;

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
`**Channel:** ${channel}
**Action:** \`${action}\`
**Type:** \`${channel.type || "Unknown"}\``;

    const changesSection =
        listSection(
            "Changes:",
            changes
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
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**Event ID:** \`${eventId || "N/A"}\``
                )
        );

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

    const information =
`**Channel:** ${channel || "Unknown"}
**Actions:** \`${actions}\`
**Threshold:** \`${threshold}\`
**Punishment:** \`${punishment || "N/A"}\``;

    const detectedSection =
        listSection(
            "Detected:",
            detectedActions
        );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## AntiNuke Alert\n> ${user} made several changes to the server's channels.`
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
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result || "The user was punished."}`
                )
        );

}


function recovery(
    user,
    channels = [],
    recoveredActions = [],
    result = "Everything was restored."
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
`**Module:** \`channel\`
**Recovered:** \`${channels.length} channels\``;

    const recoveredChannels =
        listSection(
            "Recovered:",
            channelList
        );

    const recoveredActionsSection =
        listSection(
            "Changes:",
            recoveredActions
        );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Changes Restored\n> The changes made by ${user} were restored.`
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
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        );

}


function failed(
    user,
    channel,
    failedActions = [],
    result =
        "Some changes could not be restored.",
    action = "restore"
) {

    const information =
`**Channel:** ${channel || "Unknown"}
**Action:** \`${action}\``;

    const failedSection =
        listSection(
            "Failed:",
            failedActions
        );

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Protection Failed\n> Some of the changes made by ${user} could not be restored.`
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
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        );

}


module.exports = {
    event,
    triggered,
    recovery,
    failed
};
