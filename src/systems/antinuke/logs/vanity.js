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
    oldVanity,
    newVanity,
    result = "The vanity change was detected and restored.",
    eventId = null
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`vanity\`
**Action:** \`${action}\`
**Old Vanity:** \`${oldVanity || "None"}\`
**New Vanity:** \`${newVanity || "None"}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Vanity Updated\n> ${user} changed the server vanity from \`${oldVanity || "None"}\` to \`${newVanity || "None"}\`.`
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
    oldVanity,
    attemptedVanity,
    actions,
    threshold,
    punishment,
    result,
    detectedActions = []
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`vanity\`
**Old Vanity:** \`${oldVanity || "None"}\`
**Attempted Vanity:** \`${attemptedVanity || "None"}\`
**Action:** \`vanity changed\`
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
                    `## AntiNuke Alert\n> ${user} attempted to change the server vanity.`
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
    vanity,
    result = "The original vanity was restored successfully."
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`vanity\`
**Vanity:** \`${vanity || "None"}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.regular
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    "## Vanity Restored\n> The server vanity was restored after an unauthorized change was detected."
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
            new TextDisplayBuilder()
                .setContent(
                    `**Result:** ${result}`
                )
        );

}


function failed(
    user,
    oldVanity,
    attemptedVanity,
    result = "Failed to restore the original server vanity.",
    action = "vanity changed"
) {

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`vanity\`
**Action:** \`${action}\`
**Old Vanity:** \`${oldVanity || "None"}\`
**Attempted Vanity:** \`${attemptedVanity || "None"}\``;

    return new ContainerBuilder()
        .setAccentColor(
            config.colors.failed
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## Vanity Protection Failed\n> ${user} attempted to change the server vanity, but AntiNuke could not restore it.`
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
