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


const DANGEROUS_PERMISSIONS = {
    Administrator: "Administrator",
    ManageGuild: "ManageGuild",
    ManageRoles: "ManageRoles",
    ManageChannels: "ManageChannels",
    ManageWebhooks: "ManageWebhooks",
    BanMembers: "BanMembers",
    KickMembers: "KickMembers",
    ModerateMembers: "ModerateMembers",
    ManageMessages: "ManageMessages",
    ManageThreads: "ManageThreads",
    MentionEveryone: "MentionEveryone",
    ManageNicknames: "ManageNicknames",
    ManageEmojisAndStickers: "ManageEmojisAndStickers",
    ManageEvents: "ManageEvents",
    ViewAuditLog: "ViewAuditLog"
};


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
                content || ""
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


function rolesSection(
    title,
    roles = []
) {

    const list =
        Array.isArray(roles)
            ? roles
            : [roles];

    const content =
        list
            .filter(Boolean)
            .map(
                role => {

                    if (
                        typeof role ===
                        "string"
                    ) {

                        return `• ${role}`;

                    }

                    return (
                        `• ${role.name || "Unknown role"} ` +
                        `[${role.id}]`
                    );

                }
            )
            .join("\n") || "None";

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
    role,
    changes = [],
    result = "Role permission event detected.",
    eventId = null
) {

    const multipleRoles =
        Array.isArray(role);

    const information =
        multipleRoles
            ? `**Member:** ${user}
\`${user.id}\`

**Module:** \`role\`
**Action:** \`${action}\``
            : `**Member:** ${user}
\`${user.id}\`

**Module:** \`role\`
**Action:** \`${action}\`
**Role:** ${role || "Unknown"}
**Role ID:** [${role?.id || "N/A"}]`;

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

    const title =
        "Role Permissions";

    const description =
        multipleRoles
            ? `> detected dangerous permissions being **${action}** on multiple roles.`
            : `> detected dangerous permissions being **${action}** on ${role || "a role"}.`;

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
        multipleRoles
    ) {

        container
            .addTextDisplayComponents(
                rolesSection(
                    "Roles:",
                    role
                )
            )
            .addSeparatorComponents(
                separator()
            );

    }

    return container
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
    role
) {

    const multipleRoles =
        Array.isArray(role);

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`role\`
**Activity:** \`${actions} actions\`
**Threshold:** \`${threshold} actions\`
**Punishment:** \`${punishment || "N/A"}\`
**Result:** ${result || "N/A"}`;

    const roles =
        multipleRoles
            ? rolesSection(
                "Affected roles:",
                role
            )
            : new TextDisplayBuilder()
                .setContent(
`**Role:** ${role || "Unknown"}
**Role ID:** [${role?.id || "N/A"}]`
                );

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
                    `> detected dangerous role permission activity from ${user}.`
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
            roles
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
    role,
    recoveredActions = [],
    result = "Role permissions restored."
) {

    const multipleRoles =
        Array.isArray(role);

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`role\``;

    const roles =
        multipleRoles
            ? rolesSection(
                "Recovered roles:",
                role
            )
            : new TextDisplayBuilder()
                .setContent(
`**Role:** ${role || "Unknown"}
**Role ID:** [${role?.id || "N/A"}]`
                );

    const recoveredSection =
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
                    "## Restored\n" +
                    "> successfully restored the affected role permissions."
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
            roles
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            recoveredSection
        )
        .addSeparatorComponents(
            separator()
        )
        .addTextDisplayComponents(
            resultSection
        );

}


function dangerousPermissions(
    permissions = []
) {

    return permissions.filter(
        permission =>
            Object.prototype.hasOwnProperty.call(
                DANGEROUS_PERMISSIONS,
                permission
            )
    );

}


module.exports = {
    DANGEROUS_PERMISSIONS,
    dangerousPermissions,
    event,
    triggered,
    recovery
};
