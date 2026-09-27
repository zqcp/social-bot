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
    target,
    changes = [],
    result = "The event was recorded.",
    eventId = null
) {

    const actionText =
        action || "updated";

    const targetText =
        target || "Unknown";

    let title =
        "Event Updated";

    let description =
        `> ${user} updated ${targetText}.`;

    if (
        actionText === "created"
    ) {

        title =
            "Event Created";

        description =
            `> ${user} created ${targetText}.`;

    }

    if (
        actionText === "deleted"
    ) {

        title =
            "Event Deleted";

        description =
            `> ${user} deleted ${targetText}.`;

    }

    if (
        actionText === "added"
    ) {

        title =
            "Event Added";

        description =
            `> ${user} added ${targetText}.`;

    }

    if (
        actionText === "removed"
    ) {

        title =
            "Event Removed";

        description =
            `> ${user} removed ${targetText}.`;

    }

    const information =
`**Target:** ${targetText}
**Action:** \`${actionText}\``;

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
            listSection(
                "Changes:",
                changes
            )
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
    target
) {

    const information =
`**Target:** ${target || "Unknown"}
**Actions:** \`${actions}\`
**Threshold:** \`${threshold}\`
**Punishment:** \`${punishment || "N/A"}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## AntiNuke Alert\n> ${user} made several changes that exceeded the configured protection threshold.`
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
            listSection(
                "Detected:",
                detectedActions
            )
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
    recovered = [],
    changes = [],
    result = "Everything was restored."
) {

    const recoveredList =
        recovered.map(
            item => {

                if (
                    typeof item === "string"
                ) {
                    return item;
                }

                return (
                    `${item.name || "Unknown"} ` +
                    `[${item.id || "N/A"}]`
                );

            }
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
                `**Recovered:** \`${recovered.length}\``
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            listSection(
                "Recovered:",
                recoveredList
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            listSection(
                "Changes:",
                changes
            )
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
    target,
    failedActions = [],
    result = "Some changes could not be restored.",
    action = "restore"
) {

    const information =
`**Target:** ${target || "Unknown"}
**Action:** \`${action}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Protection Failed\n> Some changes made by ${user} could not be restored.`
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
            listSection(
                "Failed:",
                failedActions
            )
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
