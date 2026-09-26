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

    const text =
        new TextDisplayBuilder()
            .setContent(
                content
            );

    const section =
        new SectionBuilder()
            .addTextDisplayComponents(
                text
            );

    if (
        user
    ) {

        const avatar =
            user.displayAvatarURL({
                dynamic: true,
                size: 256
            });

        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(
                    avatar
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
    result = "Channel event detected.",
    eventId = null
) {

    let title =
        "Channel Event";

    let description =
        `> AntiNuke detected a channel **${action}** event performed by ${user}.`;

    if (
        action === "created"
    ) {

        title =
            "Channel Created";

        description =
            `> AntiNuke detected a new channel being **created** by ${user}.`;

    }

    if (
        action === "updated"
    ) {

        title =
            "Channel Updated";

        description =
            `> AntiNuke detected a channel **update** performed by ${user}.`;

    }

    if (
        action === "deleted"
    ) {

        title =
            "Channel Deleted";

        description =
            `> AntiNuke detected a channel being **deleted** by ${user}.`;

    }

    const information =
`**Triggered by:** ${user}
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
            action === "deleted"
                ? config.colors.failed
                : config.colors.regular
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
`**Triggered by:** ${user}
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
            0xFFFFFF
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## AntiNuke Triggered\n" +
                    `> AntiNuke detected destructive activity from ${user} and activated the \`channel\` protection.`
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

                            return channel;

                        }

                        return (
                            `${channel.name || "Unknown channel"} ` +
                            `(\`${channel.id}\`)`
                        );

                    }
                )
            : [];

    const information =
`**Triggered by:** ${user}
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
            config.colors.success
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## AntiNuke Recovery\n" +
                    "> successfully recovered the affected channels."
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


module.exports = {
    event,
    triggered,
    recovery
};
