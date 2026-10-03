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
    result = "The ban was recorded successfully."
) {

    const targetText =
        target || "Unknown user";

    const actionText =
        action || "banned";

    let title =
        "User Banned";

    let description =
        `> ${user} banned ${targetText}.`;

    if (
        actionText === "unbanned" ||
        actionText === "deleted"
    ) {

        title =
            "User Unbanned";

        description =
            `> ${user} removed the ban from ${targetText}.`;

    }

    if (
        actionText === "updated"
    ) {

        title =
            "Ban Updated";

        description =
            `> ${user} updated the ban for ${targetText}.`;

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
                        `## ${title}\n` +
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
    detectedActions = [],
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
                        `## Mass Ban Alert\n` +
                        `> Detected mass banning from ${user}.`
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
            detectedActions
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
        "The affected bans were reverted successfully."
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
                    `${item.name || "Unknown user"} ` +
                    `[\`${item.id || "N/A"}\`]`
                );

            }
        );

    const details =
        `**User:** ${user}\n` +
        `**Recovered:** \`${recovered.length}\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Bans Reverted\n` +
                        `> The affected bans were reverted.`
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

    const restoredList =
        list(
            "Reverted:",
            recoveredList
        );

    if (restoredList) {

        container
            .addSeparatorComponents(
                separator()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        restoredList
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
        "The ban action could not be completed.",
    action = "ban"
) {

    const targetText =
        target || "Unknown user";

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
                        `## Ban Failed\n` +
                        `> ${user} couldn't complete the ban action for ${targetText}.`
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
