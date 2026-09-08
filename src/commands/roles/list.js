const {
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "roles",

    aliases: [ ],

    async execute(
        client,
        message,
        args
    ) {

        // =========================
        // GUILD CHECK
        // =========================

        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

        // =========================
        // USER PERMISSION
        // =========================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageRoles"
                    )
                ]
            });
        }

        // =========================
        // BOT PERMISSIONS
        // =========================

        const botMember =
            message.guild.members.me;

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !message.channel
                        .permissionsFor(botMember)
                        ?.has(permission)
            );

        if (missingPermissions.length) {
            const permissionNames =
                missingPermissions.map(
                    permission =>
                        Object.entries(
                            PermissionFlagsBits
                        ).find(
                            ([, value]) =>
                                value === permission
                        )?.[0] || permission
                );

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // GET ROLES
        // =========================

        const roles =
            message.guild.roles.cache
                .filter(
                    role =>
                        role.id !==
                            message.guild.id &&
                        !role.managed
                )
                .sort(
                    (a, b) =>
                        b.position -
                        a.position
                );

        const roleArray =
            [...roles.values()];

        // =========================
        // PAGINATION
        // =========================

        const rolesPerPage = 25;

        const totalRoles =
            roleArray.length;

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    totalRoles /
                    rolesPerPage
                )
            );

        const page = 1;

        const start =
            (page - 1) *
            rolesPerPage;

        const pageRoles =
            roleArray.slice(
                start,
                start + rolesPerPage
            );

        // =========================
        // DESCRIPTION
        // =========================

        const description =
            pageRoles.length
                ? pageRoles
                    .map(
                        (role, index) => {

                            const number =
                                String(
                                    start +
                                    index +
                                    1
                                ).padStart(
                                    2,
                                    "0"
                                );

                            return `\`${number}\` ${role} • \`${role.id}\``;
                        }
                    )
                    .join("\n")
                : "No roles found.";

        // =========================
        // EMBED
        // =========================

        const embed =
            globalEmbeds
                .regular(
                    description
                )
                .setTitle(
                    `${message.guild.name}'s Roles`
                )
                .setThumbnail(
                    message.guild.iconURL({
                        dynamic: true
                    })
                )
                .setFooter({
                    text:
                        `Page ${page}/${totalPages} • (${totalRoles} roles)`
                });

        // =========================
        // BUTTONS
        // =========================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list_previous_${message.id}`
                        )
                        .setLabel("‹")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page <= 1
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list_next_${message.id}`
                        )
                        .setLabel("›")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page >= totalPages
                        )

                );

        // =========================
        // SEND
        // =========================

        return message.channel.send({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        });

    }

};
