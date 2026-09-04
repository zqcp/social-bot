const interactionEmbeds =
    require("../../embeds/general/interaction");

const {
    getSession,
    buildMessage
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "selectMenu",

    async execute(client, interaction) {

        const session =
            getSession(
                interaction.user.id,
                interaction.guildId
            );

        if (!session) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.selectDisabled(
                        "This embed builder session has expired."
                    )
                ],
                flags: 64
            });
        }

        const customId =
            interaction.customId;

        if (!customId.startsWith("embed:")) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.selectInvalid(
                        "This select menu action is invalid."
                    )
                ],
                flags: 64
            });
        }

        const menuId =
            customId.slice("embed:".length);

        // =========================
        // EMBED SELECTOR
        // =========================

        if (menuId === "embed") {

            const value =
                interaction.values[0];

            if (!value) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectRequired(
                            "Please select an embed."
                        )
                    ],
                    flags: 64
                });
            }

            const index =
                Number(value);

            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >=
                    session.data.embeds.length
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That embed could not be found."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.activeEmbed =
                index;

            await refreshEditor(
                client,
                session,
                interaction
            );

            return interaction.reply({
                embeds: [
                    interactionEmbeds.selectSuccess(
                        `Embed ${index + 1} selected.`
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // BUTTON STYLE
        // =========================

        if (menuId === "button-style") {

            const value =
                interaction.values[0];

            const styles = [
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ];

            if (!styles.includes(value)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That button style is invalid."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                !Array.isArray(
                    session.data.buttons
                )
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "There are no buttons to edit."
                        )
                    ],
                    flags: 64
                });
            }

            const index =
                Number(
                    session.data.activeButton ?? 0
                );

            const button =
                session.data.buttons[index];

            if (!button) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That button could not be found."
                        )
                    ],
                    flags: 64
                });
            }

            button.style =
                value;

            await refreshEditor(
                client,
                session,
                interaction
            );

            return interaction.reply({
                embeds: [
                    interactionEmbeds.selectSuccess(
                        "Button style updated."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // SELECT MENU TYPE
        // =========================

        if (menuId === "select-type") {

            const value =
                interaction.values[0];

            const types = [
                "string",
                "user",
                "role",
                "mentionable",
                "channel"
            ];

            if (!types.includes(value)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That select menu type is invalid."
                        )
                    ],
                    flags: 64
                });
            }

            const index =
                Number(
                    session.data.activeSelectMenu ?? 0
                );

            const menu =
                session.data.selectMenus?.[index];

            if (!menu) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That select menu could not be found."
                        )
                    ],
                    flags: 64
                });
            }

            menu.type =
                value;

            await refreshEditor(
                client,
                session,
                interaction
            );

            return interaction.reply({
                embeds: [
                    interactionEmbeds.selectSuccess(
                        "Select menu type updated."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // UNKNOWN MENU
        // =========================

        return interaction.reply({
            embeds: [
                interactionEmbeds.selectInvalid(
                    "This select menu action is not available."
                )
            ],
            flags: 64
        });
    }
};


// =========================
// REFRESH EDITOR
// =========================

async function refreshEditor(
    client,
    session,
    interaction
) {

    if (
        !session.channelId ||
        !session.messageId
    ) {
        return;
    }

    const channel =
        client.channels.cache.get(
            session.channelId
        );

    if (!channel) {
        return;
    }

    try {

        const message =
            await channel.messages.fetch(
                session.messageId
            );

        const data =
            buildMessage(
                session,
                interaction
            );

        await message.edit({
            content: data.content,
            embeds: data.embeds,
            components: data.components
        });

    } catch (error) {

        console.error(
            "[EMBED SELECT MENU]",
            error
        );
    }
}
