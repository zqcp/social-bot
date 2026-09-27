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
    result = "The role permission changes were recorded.",
    eventId = null
) {

    const multipleRoles =
        Array.isArray(role);

    const title =
        action === "created"
            ? "Role Permissions Added"
            : action === "deleted"
                ? "Role Permissions Removed"
                : "Role Permissions Updated";

    const description =
        multipleRoles
            ? `> ${user} updated dangerous permissions on multiple roles.`
            : `> ${user} updated dangerous permissions on ${role || "a role"}.`;

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
**Role ID:** \`${role?.id || "N/A"}\``;

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

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        "## AntiNuke Alert\n" +
                        `> ${user} made several dangerous changes to role permissions.`
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
                    "Affected roles:",
                    role
                )
            )
            .addSeparatorComponents(
                separator()
            );

    } else {

        container
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
`**Role:** ${role || "Unknown"}
**Role ID:** \`${role?.id || "N/A"}\``
                    )
            )
            .addSeparatorComponents(
                separator()
            );

    }

    return container
        .addTextDisplayComponents(
            listSection(
                "Detected actions:",
                detectedActions
            )
        );

}


function recovery(
    user,
    role,
    recoveredActions = [],
    result =
        "The affected role permissions were successfully restored."
) {

    const multipleRoles =
        Array.isArray(role);

    const information =
`**Member:** ${user}
\`${user.id}\`

**Module:** \`role\``;

    const container =
        new ContainerBuilder()
            .setAccentColor(
                config.colors.regular
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        "## Roles Restored\n" +
                        "> The affected role permissions were successfully restored."
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
                    "Recovered roles:",
                    role
                )
            )
            .addSeparatorComponents(
                separator()
            );

    } else {

        container
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
`**Role:** ${role || "Unknown"}
**Role ID:** \`${role?.id || "N/A"}\``
                    )
            )
            .addSeparatorComponents(
                separator()
            );

    }

    return container
        .addTextDisplayComponents(
            listSection(
                "Recovered actions:",
                recoveredActions
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
