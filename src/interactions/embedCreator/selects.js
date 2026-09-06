const state = require("../../systems/embedCreator/state");
const variables = require("../../systems/embedCreator/variables");
const interactionEmbeds = require("../../embeds/general/interaction");

// =========================
// OWNERSHIP
// =========================

function isOwner(interaction, session) {
    return (
        session &&
        interaction.user.id === session.userId
    );
}

// =========================
// VARIABLE VALUES
// =========================

function getVariableList() {
    return Object.keys(
        variables.getVariables()
    );
}

// =========================
// VARIABLE PICKER
// =========================

async function variablePicker(
    interaction
) {
    const selected =
        interaction.values?.[0];

    if (!selected) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "No variable was selected."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `\`${selected}\``,
        flags: 64
    });
}

// =========================
// COMPONENT MANAGER
// =========================

async function componentManager(
    interaction
) {
    const selected =
        interaction.values?.[0];

    if (!selected) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "No component was selected."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `🧩 Selected component \`${selected}\`.`,
        flags: 64
    });
}

// =========================
// FIELD MANAGER
// =========================

async function fieldManager(
    interaction
) {
    const selected =
        interaction.values?.[0];

    if (!selected) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "No field was selected."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `📋 Selected field \`${selected}\`.`,
        flags: 64
    });
}

// =========================
// ROUTER
// =========================

async function execute(
    client,
    interaction
) {
    const customId =
        interaction.customId || "";

    const action =
        customId
            .split(":")
            .slice(1)
            .join(":")
            .toLowerCase();

    const session =
        state.get(
            interaction.user.id
        );

    if (!session) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorExpired()
            ],
            flags: 64
        });
    }

    if (
        !isOwner(
            interaction,
            session
        )
    ) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorNoPermission()
            ],
            flags: 64
        });
    }

    switch (action) {
        case "variables":
        case "variable":
            return variablePicker(
                interaction
            );

        case "components":
        case "component":
            return componentManager(
                interaction
            );

        case "fields":
        case "field":
            return fieldManager(
                interaction
            );

        default:
            return interaction.reply({
                embeds: [
                    interactionEmbeds.embedCreatorFailed(
                        "That creator selection is not available."
                    )
                ],
                flags: 64
            });
    }
}

// =========================
// EXPORTS
// =========================

module.exports = {
    name: "embedCreator",
    type: "select",
    execute
};
