const {
    PermissionFlagsBits
} = require("discord.js");

const {
    getSession,
    updateSession,
    saveSession,
    updateSentMessages
} = require("../../systems/embed/builder");

const {
    addButton,
    editButton,
    removeButton,
    moveButton,
    setActiveButton
} = require("../../systems/embed/buttons");

const globalEmbeds =
    require("../../embeds/general/global");

const interactionEmbeds =
    require("../../embeds/general/interaction");


// ============================================================
// HELPERS
// ============================================================

function getUser(interaction) {
    return interaction.user;
}

function getSessionForInteraction(interaction) {
    return getSession(
        interaction.user.id
    );
}

async function deny(interaction, embed) {
    if (interaction.replied || interaction.deferred) {
        return interaction.editReply({
            embeds: [embed]
        });
    }

    return interaction.reply({
        embeds: [embed],
        flags: 64
    });
}


// ============================================================
// MAIN
// ============================================================

module.exports = {

    name: "embedButtons",

    async execute(interaction, client) {

        if (!interaction.isButton()) {
            return;
        }

        if (!interaction.customId.startsWith("embed:")) {
            return;
        }

        const session =
            getSessionForInteraction(interaction);

        if (!session) {
            return deny(
                interaction,
                interactionEmbeds.sessionExpired(
                    getUser(interaction)
                )
            );
        }

        if (
            session.guildId !== interaction.guildId
        ) {
            return deny(
                interaction,
                globalEmbeds.error(
                    "This embed editor session belongs to another server."
                )
            );
        }

        const id =
            interaction.customId;


        // ====================================================
        // ADD BUTTON
        // ====================================================

        if (id === "embed:add-button") {

            addButton(session, {
                label: "Button",
                style: "secondary",
                customId:
                    `embed:button:${Date.now()}`,
                disabled: false,
                action: "none",
                roleId: ""
            });

            updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Added",
                        "button"
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // SELECT BUTTON
        // ====================================================

        if (id === "embed:button-select") {

            if (!session.data.buttons.length) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "There are no buttons to select."
                    )
                );
            }

            return interaction.reply({
                content:
                    "Select a button from the editor.",
                flags: 64
            });
        }


        // ====================================================
        // REMOVE BUTTON
        // ====================================================

        if (id === "embed:remove-button") {

            const index =
                Number(session.data.activeButton) || 0;

            const removed =
                removeButton(
                    session,
                    index
                );

            if (!removed) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "There is no button to remove."
                    )
                );
            }

            updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.deleted(
                        interaction.user,
                        "button",
                        removed.label || "Button"
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // MOVE BUTTON
        // ====================================================

        if (id === "embed:move-button-up") {

            const index =
                Number(session.data.activeButton) || 0;

            if (index <= 0) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "That button is already first."
                    )
                );
            }

            moveButton(
                session,
                index,
                index - 1
            );

            updateSession(session);

            return interaction.update();
        }


        if (id === "embed:move-button-down") {

            const index =
                Number(session.data.activeButton) || 0;

            if (
                index >=
                session.data.buttons.length - 1
            ) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "That button is already last."
                    )
                );
            }

            moveButton(
                session,
                index,
                index + 1
            );

            updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // EDIT BUTTON
        // ====================================================

        if (id === "embed:edit-button") {

            if (!session.data.buttons.length) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "There are no buttons to edit."
                    )
                );
            }

            const index =
                Number(session.data.activeButton) || 0;

            if (
                !session.data.buttons[index]
            ) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "That button could not be found."
                    )
                );
            }

            return interaction.reply({
                content:
                    "Use the button editor to change this button.",
                flags: 64
            });
        }


        // ====================================================
        // SAVE
        // ====================================================

        if (id === "embed:save") {

            try {

                const member =
                    interaction.member;

                if (
                    !member.permissions.has(
                        PermissionFlagsBits.ManageMessages
                    )
                ) {
                    return deny(
                        interaction,
                        globalEmbeds.permission(
                            interaction.user,
                            PermissionFlagsBits.ManageMessages
                        )
                    );
                }

                const saved =
                    await saveSession(session);

                await updateSentMessages(
                    saved,
                    interaction.message,
                    client
                );

                return interaction.reply({
                    embeds: [
                        globalEmbeds.updated(
                            interaction.user,
                            "embed",
                            saved.name
                        )
                    ],
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "Embed save error:",
                    error
                );

                return deny(
                    interaction,
                    globalEmbeds.actionFailed(
                        interaction.user,
                        "Save"
                    )
                );
            }
        }


        // ====================================================
        // CANCEL
        // ====================================================

        if (id === "embed:cancel") {

            const {
                deleteSession
            } =
                require(
                    "../../systems/embed/builder"
                );

            deleteSession(
                interaction.user.id
            );

            return interaction.update({
                content: "Embed editor cancelled.",
                embeds: [],
                components: []
            });
        }


        // ====================================================
        // SET ACTIVE BUTTON
        // ====================================================

        const buttonMatch =
            id.match(
                /^embed:button:(\d+)$/
            );

        if (buttonMatch) {

            const index =
                Number(buttonMatch[1]);

            if (
                !session.data.buttons[index]
            ) {
                return deny(
                    interaction,
                    globalEmbeds.error(
                        "That button could not be found."
                    )
                );
            }

            setActiveButton(
                session,
                index
            );

            updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // UNKNOWN
        // ====================================================

        return;
    }

};
