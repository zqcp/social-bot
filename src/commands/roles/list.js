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
        // FETCH MEMBERS
        // =========================

        await message.guild.members.fetch();

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

        let page = 1;

        // =========================
        // TIMER STORAGE
        // =========================

        if (!client.roleListTimers) {
            client.roleListTimers =
                new Map();
        }

        // =========================
        // RENDER PAGE
        // =========================

        const renderPage = () => {

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

                                return `\`${number}\` ${role} — \`${role.id}\` — ${role.members.size} member(s)`;
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
                        `Roles in ${message.guild.name}`
                    )
                    .setFooter({
                        text:
                            `Page ${page}/${totalPages} • ${totalRoles} roles`
                    });

            // =========================
            // BUTTONS
            // =========================

            const row =
                new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId(
                                `role_list:previous:${message.author.id}`
                            )
                            .setLabel("Previous")
                            .setEmoji("◀️")
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                            .setDisabled(
                                page <= 1
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                `role_list:page:${message.author.id}`
                            )
                            .setLabel(
                                `${page}/${totalPages}`
                            )
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId(
                                `role_list:next:${message.author.id}`
                            )
                            .setLabel("Next")
                            .setEmoji("▶️")
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                            .setDisabled(
                                page >= totalPages
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                `role_list:delete:${message.author.id}`
                            )
                            .setLabel("Delete")
                            .setEmoji("⏹️")
                            .setStyle(
                                ButtonStyle.Danger
                            )

                    );

            return {
                embeds: [
                    embed
                ],
                components: [
                    row
                ]
            };
        };

        // =========================
        // SEND
        // =========================

        const sentMessage =
            await message.channel.send(
                renderPage()
            );

        // =========================
        // BUTTON COLLECTOR
        // =========================

        const collector =
            sentMessage.createMessageComponentCollector({
                time: 60000
            });

        // =========================
        // COLLECT
        // =========================

        collector.on(
            "collect",
            async interaction => {

                // =========================
                // BUTTON CHECK
                // =========================

                if (
                    !interaction.customId.startsWith(
                        "role_list:"
                    )
                ) {
                    return;
                }

                const parts =
                    interaction.customId.split(":");

                const action =
                    parts[1];

                const ownerId =
                    parts[2];

                // =========================
                // USER CHECK
                // =========================

                if (
                    interaction.user.id !==
                    ownerId
                ) {
                    return interaction.reply({
                        content:
                            "You cannot use this!",
                        flags: 64
                    });
                }

                // =========================
                // DELETE
                // =========================

                if (
                    action ===
                    "delete"
                ) {

                    collector.stop(
                        "deleted"
                    );

                    const timer =
                        client.roleListTimers.get(
                            sentMessage.id
                        );

                    if (timer) {
                        clearTimeout(timer);

                        client.roleListTimers.delete(
                            sentMessage.id
                        );
                    }

                    return sentMessage
                        .delete()
                        .catch(() => {});
                }

                // =========================
                // PREVIOUS
                // =========================

                if (
                    action ===
                        "previous" &&
                    page > 1
                ) {
                    page--;
                }

                // =========================
                // NEXT
                // =========================

                if (
                    action ===
                        "next" &&
                    page < totalPages
                ) {
                    page++;
                }

                // =========================
                // PAGE BUTTON
                // =========================

                if (
                    action ===
                    "page"
                ) {
                    return interaction.deferUpdate();
                }

                // =========================
                // UPDATE
                // =========================

                await interaction.update(
                    renderPage()
                );
            }
        );

        // =========================
        // 60 SECOND TIMEOUT
        // =========================

        const timer =
            setTimeout(
                async () => {

                    try {

                        const disabledRow =
                            new ActionRowBuilder()
                                .addComponents(

                                    new ButtonBuilder()
                                        .setCustomId(
                                            `role_list:previous:${message.author.id}`
                                        )
                                        .setLabel(
                                            "Previous"
                                        )
                                        .setEmoji(
                                            "◀️"
                                        )
                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )
                                        .setDisabled(
                                            true
                                        ),

                                    new ButtonBuilder()
                                        .setCustomId(
                                            `role_list:page:${message.author.id}`
                                        )
                                        .setLabel(
                                            `${page}/${totalPages}`
                                        )
                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )
                                        .setDisabled(
                                            true
                                        ),

                                    new ButtonBuilder()
                                        .setCustomId(
                                            `role_list:next:${message.author.id}`
                                        )
                                        .setLabel(
                                            "Next"
                                        )
                                        .setEmoji(
                                            "▶️"
                                        )
                                        .setStyle(
                                            ButtonStyle.Secondary
                                        )
                                        .setDisabled(
                                            true
                                        ),

                                    new ButtonBuilder()
                                        .setCustomId(
                                            `role_list:delete:${message.author.id}`
                                        )
                                        .setLabel(
                                            "Delete"
                                        )
                                        .setEmoji(
                                            "⏹️"
                                        )
                                        .setStyle(
                                            ButtonStyle.Danger
                                        )
                                        .setDisabled(
                                            true
                                        )

                                );

                        await sentMessage.edit({
                            components: [
                                disabledRow
                            ]
                        });

                    } catch (error) {

                        console.error(
                            "Role List Timeout Error:",
                            error
                        );

                    }

                    client.roleListTimers.delete(
                        sentMessage.id
                    );

                    collector.stop(
                        "timeout"
                    );

                },
                60000
            );

        client.roleListTimers.set(
            sentMessage.id,
            timer
        );

        return sentMessage;

    }

};
