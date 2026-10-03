const {
    ContainerBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder
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


function list(
    title,
    items = []
) {

    if (!items.length) {
        return null;
    }

    if (items.length === 1) {

        return (
            `**${title}**\n` +
            `> • ${items[0]}`
        );

    }

    return (
        `**${title}**\n` +
        "```\n" +
        items
            .map(
                item =>
                    `• ${item}`
            )
            .join("\n") +
        "\n```"
    );

}


function event(
    user,
    action,
    target,
    changes = [],
    result =
        "The server vanity URL was updated."
) {

    const targetText =
        target || "Server Vanity URL";

    const actionText =
        action || "updated";

    let description =
        `> ${user} updated the server vanity URL.`;

    if (
        actionText === "deleted" ||
        actionText === "removed"
    ) {

        description =
            `> ${user} removed the server vanity URL.`;

    }

    const details =
        `**User:** ${user}\n` +
        `**Target:** ${targetText}\n` +
        `**Action:** \`${actionText}\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Vanity Updated\n` +
                        description
                    )
            )
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `**Details**\n${details}`
                    )
            );

    const changesList =
        list(
            "Changes:",
            changes
        );

    if (changesList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        changesList
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


function triggered(
    user,
    actions,
    threshold,
    detectedChanges = [],
    punishment,
    result
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

    const details =
        `**User:** ${user}\n` +
        `**Target:** Server Vanity URL\n` +
        `**Actions:** \`${actions}\`\n` +
        `**Threshold:** \`${threshold}\`\n` +
        `**Punishment:** \`${punishmentText}\``;

    const container =
        new ContainerBuilder()
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
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `**Details**\n${details}`
                    )
            );

    const detectedList =
        list(
            "Detected:",
            detectedChanges
        );

    if (detectedList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        detectedList
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
                    `**Result:** ${result || punishmentResult}`
                )
        );

    return container;

}


function recovery(
    user,
    recovered = [],
    changes = [],
    result =
        "The server vanity URL was reverted successfully."
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

    const details =
        `**User:** ${user}\n` +
        `**Target:** Server Vanity URL\n` +
        `**Action:** \`revert\`\n` +
        `**Recovered:** \`${recovered.length}\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Vanity Reverted\n` +
                        `> The server vanity URL was reverted.`
                    )
            )
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `**Details**\n${details}`
                    )
            );

    const revertedList =
        list(
            "Reverted:",
            recoveredList
        );

    if (revertedList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        revertedList
                    )
            );

    }

    const changesList =
        list(
            "Changes:",
            changes
        );

    if (changesList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        changesList
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

    const details =
        `**Target:** ${targetText}\n` +
        `**Action:** \`${action}\``;

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
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `**Details**\n${details}`
                    )
            );

    const failedList =
        list(
            "Failed:",
            failedActions
        );

    if (failedList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        failedList
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
