const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config =
    require("../../config");

// =========================
// ROLE LIST BUTTONS
// =========================

module.exports = {

    name: "role_list",

    type: "button",

    async execute(
        client,
        interaction
    ) {

        if (
            !interaction.isButton() ||
            !interaction.customId.startsWith("role_list:")
        ) {
            return;
        }

        const [
            ,
            action,
            ownerId
        ] = interaction.customId.split(":");

        // =========================
        // OWNER CHECK
        // =========================

        if (
            interaction.user.id !== ownerId
        ) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${interaction.user}: You cannot use this!`
                        )
                ],
                flags: 64
            });
        }

        // =========================
        // TIMER
        // =========================

        if (!client.roleListTimers) {
            client.roleListTimers =
                new Map();
        }

        const messageId =
            interaction.message.id;

        const resetTimer = () => {

            const oldTimer =
                client.roleListTimers.get(
                    messageId
                );

            if (oldTimer) {
                clearTimeout(oldTimer);
            }

            const timer =
                setTimeout(
                    async () => {

                        try {

                            const row =
                                new ActionRowBuilder()
                                    .addComponents(

                                        new ButtonBuilder()
                                            .setCustomId(
                                                `role_list:previous:${ownerId}`
                                            )
                                            .setEmoji("◀️")
                                            .setStyle(
                                                ButtonStyle.Secondary
                                            )
                                            .setDisabled(true),

                                        new ButtonBuilder()
                                            .setCustomId(
                                                `role_list:next:${ownerId}`
                                            )
                                            .setEmoji("▶️")
                                            .setStyle(
                                                ButtonStyle.Secondary
                                            )
                                            .setDisabled(true),

                                        new ButtonBuilder()
                                            .setCustomId(
                                                `role_list:delete:${ownerId}`
                                            )
                                            .setEmoji("⏹️")
                                            .setStyle(
                                                ButtonStyle.Danger
                                            )
                                            .setDisabled(true)

                                    );

                            await interaction.message.edit({
                                components: [row]
                            });

                        } catch {}

                        client.roleListTimers.delete(
                            messageId
                        );

                    },
                    60000
                );

            client.roleListTimers.set(
                messageId,
                timer
            );
        };

        // =========================
        // DELETE
        // =========================

        if (
            action === "delete"
        ) {

            const timer =
                client.roleListTimers.get(
                    messageId
                );

            if (timer) {
                clearTimeout(timer);
            }

            client.roleListTimers.delete(
                messageId
            );

            return interaction.message
                .delete()
                .catch(() => {});
        }

        // =========================
        // CURRENT PAGE
        // =========================

        const footer =
            interaction.message.embeds[0]
                ?.footer?.text || "";

        const match =
            footer.match(
                /Page (\d+)\/(\d+)/
            );

        if (!match) {
            return interaction.deferUpdate();
        }

        let page =
            Number(match[1]);

        const totalPages =
            Number(match[2]);

        // =========================
        // CHANGE PAGE
        // =========================

        if (
            action === "previous"
        ) {
            page--;
        }

        if (
            action === "next"
        ) {
            page++;
        }

        page =
            Math.max(
                1,
                Math.min(
                    page,
                    totalPages
                )
            );

        // =========================
        // ROLES
        // =========================

        const roles =
            interaction.guild.roles.cache
                .filter(
                    role =>
                        role.id !==
                            interaction.guild.id &&
                        !role.managed
                )
                .sort(
                    (a, b) =>
                        b.position -
                        a.position
                );

        const roleArray =
            [...roles.values()];

        const rolesPerPage =
            25;

        const totalRoles =
            roleArray.length;

        const total =
            Math.max(
                1,
                Math.ceil(
                    totalRoles /
                    rolesPerPage
                )
            );

        page =
            Math.min(
                page,
                total
            );

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
            EmbedBuilder
                .from(
                    interaction.message.embeds[0]
                )
                .setTitle(
                    `Roles in ${interaction.guild.name}`
                )
                .setDescription(
                    description
                )
                .setFooter({
                    text:
                        `Page ${page}/${total} • ${totalRoles} roles`
                });

        // =========================
        // BUTTONS
        // =========================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list:previous:${ownerId}`
                        )
                        .setEmoji("◀️")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page <= 1
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list:next:${ownerId}`
                        )
                        .setEmoji("▶️")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page >= total
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list:delete:${ownerId}`
                        )
                        .setEmoji("⏹️")
                        .setStyle(
                            ButtonStyle.Danger
                        )

                );

        // =========================
        // UPDATE
        // =========================

        await interaction.update({
            embeds: [embed],
            components: [row]
        });

        // =========================
        // RESET TIMER
        // =========================

        resetTimer();

    }

};
