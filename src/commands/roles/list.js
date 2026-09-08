const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

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

        // =========================
        // BUTTON CHECK
        // =========================

        if (
            !interaction.isButton()
        ) {
            return;
        }

        if (
            !interaction.customId.startsWith(
                "role_list:"
            )
        ) {
            return;
        }

        // =========================
        // BUTTON DATA
        // =========================

        const parts =
            interaction.customId.split(":");

        const action =
            parts[1];

        const ownerId =
            parts[2];

        // =========================
        // BUTTON OWNER CHECK
        // =========================

        if (
            interaction.user.id !==
            ownerId
        ) {
            return interaction.reply({
                content:
                    "These buttons don't belong to you.",
                flags: 64
            });
        }

        // =========================
        // GET CURRENT PAGE
        // =========================

        const currentEmbed =
            interaction.message.embeds[0];

        if (!currentEmbed) {
            return interaction.deferUpdate();
        }

        const footer =
            currentEmbed.footer?.text || "";

        const pageMatch =
            footer.match(
                /Page (\d+)\/(\d+)/
            );

        if (!pageMatch) {
            return interaction.deferUpdate();
        }

        let page =
            Number(pageMatch[1]);

        const totalPages =
            Number(pageMatch[2]);

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
        // GET ROLES
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
        // UPDATE EMBED
        // =========================

        const embed =
            EmbedBuilder
                .from(currentEmbed)
                .setDescription(
                    description
                )
                .setFooter({
                    text:
                        `Page ${page}/${totalPages} • (${totalRoles} roles)`
                });

        // =========================
        // UPDATE BUTTONS
        // =========================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            `role_list:previous:${ownerId}`
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
                            `role_list:page:${ownerId}`
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
                            `role_list:next:${ownerId}`
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
        // UPDATE MESSAGE
        // =========================

        await interaction.update({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        });

        // =========================
        // RESET 60 SECOND TIMER
        // =========================

        if (
            client.roleListTimers
        ) {

            const timer =
                client.roleListTimers.get(
                    interaction.message.id
                );

            if (timer) {
                clearTimeout(timer);
            }

            const newTimer =
                setTimeout(
                    async () => {

                        try {

                            const disabledRow =
                                new ActionRowBuilder()
                                    .addComponents(

                                        new ButtonBuilder()
                                            .setCustomId(
                                                `role_list:previous:${ownerId}`
                                            )
                                            .setLabel("‹")
                                            .setStyle(
                                                ButtonStyle.Secondary
                                            )
                                            .setDisabled(true),

                                        new ButtonBuilder()
                                            .setCustomId(
                                                `role_list:page:${ownerId}`
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
                                                `role_list:next:${ownerId}`
                                            )
                                            .setLabel("›")
                                            .setStyle(
                                                ButtonStyle.Secondary
                                            )
                                            .setDisabled(true)

                                    );

                            await interaction.message.edit({
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
                            interaction.message.id
                        );

                    },
                    60000
                );

            client.roleListTimers.set(
                interaction.message.id,
                newTimer
            );
        }

    }

};
