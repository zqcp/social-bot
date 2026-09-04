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

        const value =
            interaction.values[0];

        /*
         * EMBED SELECTOR
         */

        if (menuId === "embed") {

            const index =
                Number(value);

            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= session.data.embeds.length
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "That embed could not be selected."
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

        /*
         * BUTTON STYLE
         */

        if (menuId === "button-style") {

            if (
                !Array.isArray(
                    session.data.buttons
                ) ||
                !session.data.buttons.length
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
                    session.data.activeButton
                );

            if (
                !Number.isInteger(index) ||
                !session.data.buttons[index]
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "No button is currently selected."
                        )
                    ],
                    flags: 64
                });
            }

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

            session.data.buttons[index].style =
                value;

            if (value === "link") {
                session.data.buttons[index].customId =
                    "";
            } else {
                session.data.buttons[index].url =
                    "";
            }

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

        /*
         * SELECT MENU TYPE
         */

        if (menuId === "select-type") {

            if (
                !Array.isArray(
                    session.data.selectMenus
                ) ||
                !session.data.selectMenus.length
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "There are no select menus to edit."
                        )
                    ],
                    flags: 64
                });
            }

            const index =
                Number(
                    session.data.activeSelectMenu
                );

            if (
                !Number.isInteger(index) ||
                !session.data.selectMenus[index]
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.selectInvalid(
                            "No select menu is currently selected."
                        )
                    ],
                    flags: 64
                });
            }

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

            session.data.selectMenus[index].type =
                value;

            if (value !== "string") {
                session.data.selectMenus[index].options = [];
            }

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

        return interaction.reply({
            embeds: [
                interactionEmbeds.selectInvalid(
                    "This select menu action is invalid."
                )
            ],
            flags: 64
        });
    }
};

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
            content:
                data.content || null,
            embeds:
                data.embeds,
            components:
                data.components
        });

    } catch (error) {
        console.error(
            "[EMBED SELECT MENU]",
            error
        );
    }
}
