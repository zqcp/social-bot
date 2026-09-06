const state = require("../../systems/embedCreator/state");
const variables = require("../../systems/embedCreator/variables");
const panel = require("../../systems/embedCreator/panel");
const interactionEmbeds = require("../../embeds/general/interaction");

// =========================
// OWNERSHIP
// =========================

function isOwner(
    interaction,
    session
) {
    return (
        session &&
        interaction.user.id ===
            session.userId
    );
}

// =========================
// UPDATE PANEL
// =========================

async function updatePanel(
    interaction,
    view
) {
    await interaction.update(
        view
    );
}

// =========================
// VARIABLE LIST
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
                    "Please select a variable."
                )
            ],
            flags: 64
        });
    }

    const token =
        variables.getToken(
            selected
        );

    if (!token) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That variable is not available."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `Variable: \`${token}\``,
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
                    "Please select a field."
                )
            ],
            flags: 64
        });
    }

    const index =
        Number.parseInt(
            selected,
            10
        );

    if (
        !Number.isInteger(index)
    ) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That field selection is invalid."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `📋 Selected field \`${index + 1}\`.`,
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
                    "Please select a component."
                )
            ],
            flags: 64
        });
    }

    const index =
        Number.parseInt(
            selected,
            10
        );

    if (
        !Number.isInteger(index)
    ) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That component selection is invalid."
                )
            ],
            flags: 64
        });
    }

    return interaction.reply({
        content:
            `🧩 Selected component \`${index + 1}\`.`,
        flags: 64
    });
}

// =========================
// EXECUTE
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

    try {
        switch (action) {
            case "variables":
            case "variable":
                return variablePicker(
                    interaction
                );

            case "fields":
            case "field":
                return fieldManager(
                    interaction
                );

            case "components":
            case "component":
                return componentManager(
                    interaction
                );

            default:
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.embedCreatorInvalid(
                            "That selection is not available."
                        )
                    ],
                    flags: 64
                });
        }
    } catch (error) {
        console.error(
            "Embed Creator Select Error:",
            error
        );

        if (
            interaction.deferred ||
            interaction.replied
        ) {
            return interaction.editReply({
                embeds: [
                    interactionEmbeds.embedCreatorFailed()
                ]
            });
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorFailed()
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
    execute,
    getVariableList
};
