const state = require("../../systems/embedCreator/state");
const variables = require("../../systems/embedCreator/variables");
const panel = require("../../systems/embedCreator/panel");
const inputs = require("../../systems/embedCreator/inputs");
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
// VARIABLE LIST
// =========================

function getVariableList() {
    return Object.keys(
        variables.getVariables()
    );
}

// =========================
// VARIABLES PAGE
// =========================

async function variablePicker(
    interaction,
    session
) {
    const variableData =
        variables.getVariables();

    const embed =
        new (require("discord.js").EmbedBuilder)()
            .setTitle("Embed Variables")
            .setDescription(
                Object.entries(variableData)
                    .map(
                        ([name, data]) =>
                            `> \`${data.token || name}\` — ${data.description || "No description."}`
                    )
                    .join("\n") ||
                "> No variables available."
            );

    return interaction.update({
        embeds: [embed],
        components: [
            new (require("discord.js").ActionRowBuilder)()
                .addComponents(
                    new (require("discord.js").ButtonBuilder)()
                        .setCustomId(
                            "embedCreator:cancel"
                        )
                        .setLabel("Close")
                        .setStyle(
                            require("discord.js").ButtonStyle.Secondary
                        )
                )
        ]
    });
}

// =========================
// MAIN EDIT MENU
// =========================

async function edit(
    interaction,
    session
) {
    const selected =
        interaction.values?.[0];

    if (!selected) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "Please select an embed setting."
                )
            ],
            flags: 64
        });
    }

    switch (
        selected.toLowerCase()
    ) {
        case "content":
            return interaction.showModal(
                inputs.content(session)
            );

        case "title":
        case "description":
        case "color":
        case "url":
            return interaction.showModal(
                inputs.embed(session)
            );

        case "author":
            return interaction.showModal(
                inputs.author(session)
            );

        case "footer":
            return interaction.showModal(
                inputs.footer(session)
            );

        case "thumbnail":
        case "image":
            return interaction.showModal(
                inputs.media(session)
            );

        case "fields":
            return interaction.update(
                panel.buildFields(session)
            );

        case "timestamp": {
            const enabled =
                session.embed?.timestamp === true;

            state.updateEmbed(
                session.userId,
                "timestamp",
                !enabled
            );

            const updated =
                state.get(
                    session.userId
                );

            return interaction.update(
                panel.build(updated)
            );
        }

        default:
            return interaction.reply({
                embeds: [
                    interactionEmbeds.embedCreatorInvalid(
                        "That embed setting is not available."
                    )
                ],
                flags: 64
            });
    }
}

// =========================
// FIELD MANAGER
// =========================

async function fieldManager(
    interaction,
    session
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
        embeds: [
            interactionEmbeds.embedCreatorInvalid(
                `Field \`${index + 1}\` selected.`
            )
        ],
        flags: 64
    });
}

// =========================
// COMPONENT MANAGER
// =========================

async function componentManager(
    interaction,
    session
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
        embeds: [
            interactionEmbeds.embedCreatorInvalid(
                `Component \`${index + 1}\` selected.`
            )
        ],
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
            // -------------------------
            // MAIN EDIT DROPDOWN
            // -------------------------

            case "edit":
                return edit(
                    interaction,
                    session
                );

            // -------------------------
            // VARIABLES
            // -------------------------

            case "variables":
            case "variable":
                return variablePicker(
                    interaction,
                    session
                );

            // -------------------------
            // FIELDS
            // -------------------------

            case "fields":
            case "field":
                return fieldManager(
                    interaction,
                    session
                );

            // -------------------------
            // COMPONENTS
            // -------------------------

            case "components":
            case "component":
                return componentManager(
                    interaction,
                    session
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
