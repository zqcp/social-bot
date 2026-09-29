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
        .setSpacing(
            SeparatorSpacingSize.Small
        );

}


function userSection(
    user,
    content
) {

    return new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    content
                )
        )
        .setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(
                    user.displayAvatarURL({
                        dynamic: true,
                        size: 128
                    })
                )
        );

}


function listSection(
    title,
    items = []
) {

    if (!items.length) {
        return new TextDisplayBuilder()
            .setContent(
                `**${title}**\n> None`
            );
    }

    return new TextDisplayBuilder()
        .setContent(
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
    result = "The ban was recorded successfully.",
    eventId = null
) {

    const targetText =
        target || "Unknown user";

    let title =
        "User Banned";

    let description =
        `> ${user} banned ${targetText}.`;

    if (
        action === "deleted" ||
        action === "unbanned"
    ) {

        title =
            "User Unbanned";

        description =
            `> ${user} removed the ban from ${targetText}.`;

    }

    if (
        action === "updated"
    ) {

        title =
            "Ban Updated";

        description =
            `> ${user} updated the ban for ${targetText}.`;

    }

    const information =
        `**Triggered by:** ${user}\n` +
        `**Target:** ${targetText}\n` +
        `**Action:** \`${action || "updated"}\``;

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
            )
            .addSeparatorComponents(
                separator()
            );

    if (
        changes.length
    ) {

        container
            .addTextDisplayComponents(
                listSection(
                    "Changes:",
                    changes
                )
            )
            .addSeparatorComponents(
                separator()
            );

    }

    container
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
        `**Member:** ${user}\n` +
        `**Target:** ${target || "Multiple users"}\n` +
        `**Actions:** \`${actions}\`\n` +
        `**Threshold:** \`${threshold}\`\n` +
        `**Punishment:** \`${punishmentText}\``;

    return new ContainerBuilder()
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
                "Detected bans:",
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
        "The affected bans have been restored."
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

    const information =
        `**Triggered by:** ${user}\n` +
        `**Recovered:** \`${recovered.length}\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `## Bans Restored\n` +
                        `> ${user}'s ban changes were restored.`
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
                    "Restored bans:",
                    recoveredList
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

    const information =
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
