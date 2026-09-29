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
    result = "The server vanity URL has been updated.",
    eventId = null
) {

    const targetText =
        target || "Server Vanity URL";

    const actionText =
        action || "updated";

    let title =
        "Vanity Updated";

    let description =
        `> ${user} updated the server vanity URL.`;

    if (
        actionText === "created" ||
        actionText === "added"
    ) {

        title =
            "Vanity Updated";

        description =
            `> ${user} updated the server vanity URL.`;

    }

    if (
        actionText === "deleted" ||
        actionText === "removed"
    ) {

        title =
            "Vanity Updated";

        description =
            `> ${user} removed the server vanity URL.`;

    }

    const information =
`**Member:** ${user}
**Target:** ${targetText}
**Action:** \`${actionText}\``;

    const container =
        new ContainerBuilder()
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
            );

    if (
        changes.length
    ) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                listSection(
                    "Changes:",
                    changes
                )
            );

    }

    container
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

    return container;

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

    const punishmentText =
        punishment || "strip";

    const punishmentResult = {

        ban:
            `${user} has been banned.`,

        kick:
            `${user} has been kicked.`,

        strip:
            `${user} has had their removable roles stripped.`

    }[
        punishmentText
    ] ||
        `${user} has been restricted.`;

    const information =
`**Member:** ${user}
**Targer:** ${target || "Server Vanity URL"}
**Actions:** \`${actions}\`
**Threshold:** \`${threshold}\`
**Punishment:** \`${punishmentText}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Vanity Alert\n` +
                    `> Detected a vanity URL change from ${user}.`
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
                "Detected changes:",
                detectedActions
            )
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result || punishmentResult}`
                )
        );

}


function recovery(
    user,
    recovered = [],
    changes = [],
    result =
        "The server vanity URL has been restored."
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
                    `${item.name || "Server Vanity URL"} ` +
                    `[\`${item.id || "N/A"}\`]`
                );

            }
        );

    const information =
`**Member:** ${user}
**Target:** Server Vanity URL
**Action:** \`restore\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Vanity Restored\n` +
                        `> ${user}'s vanity URL change was restored.`
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
            );

    if (
        recovered.length
    ) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                listSection(
                    "Restored:",
                    recoveredList
                )
            );

    }

    if (
        changes.length
    ) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                listSection(
                    "Changes:",
                    changes
                )
            );

    }

    container
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        );

    return container;

}


function failed(
    user,
    target,
    failedActions = [],
    result =
        "The vanity URL could not be restored.",
    action = "restore"
) {

    const targetText =
        target || "Server Vanity URL";

    const information =
`**Target:** ${targetText}
**Action:** \`${action}\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Vanity Failed\n` +
                        `> ${user} couldn't restore the server vanity URL.`
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
            );

    if (
        failedActions.length
    ) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                listSection(
                    "Failed actions:",
                    failedActions
                )
            );

    }

    container
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        );

    return container;

}


module.exports = {
    event,
    triggered,
    recovery,
    failed
};
