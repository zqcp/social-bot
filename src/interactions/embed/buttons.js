const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const interactionEmbeds = require("../../embeds/general/interaction");
const {
    getSession,
    deleteSession
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "button",

    async execute(client, interaction) {
        const session = getSession(
            interaction.user.id,
            interaction.guildId
        );

        if (!session) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.buttonExpired()
                ],
                flags: 64
            });
        }

        const id = interaction.customId;

        // =========================
        // CANCEL
        // =========================

        if (id === "embed:cancel") {
            deleteSession(
                interaction.user.id,
                interaction.guildId
            );

            return interaction.update({
                embeds: [
                    interactionEmbeds.cancelled(
                        "The embed builder has been cancelled."
                    )
                ],
                components: []
            });
        }

        // =========================
        // PREVIEW
        // =========================

        if (id === "embed:preview") {
            const builder = require("../../systems/embed/builder");

            const embeds = builder.buildEmbeds(
                session.data.embeds,
                interaction
            );

            if (!embeds.length && !session.data.content) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.invalid(
                            "There is nothing to preview yet."
                        )
                    ],
                    flags: 64
                });
            }

            return interaction.reply({
                content: session.data.content
                    ? builder.replaceVariables(
                        session.data.content,
                        interaction
                    )
                    : undefined,
                embeds,
                components: [],
                flags: 64
            });
        }

        // =========================
        // SAVE
        // =========================

        if (id === "embed:save") {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "The embed has been saved."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // CONTENT
        // =========================

        if (id === "embed:content") {
            return showModal(
                interaction,
                "embed:content",
                "Edit Message Content",
                "content",
                "Message content",
                session.data.content || "",
                false
            );
        }

        // =========================
        // EMBED
        // =========================

        if (id === "embed:embed") {
            return showModal(
                interaction,
                "embed:embed",
                "Edit Embed",
                "description",
                "Embed description",
                session.data.embeds[0]?.description || "",
                true
            );
        }

        // =========================
        // FIELD
        // =========================

        if (id === "embed:field") {
            return showModal(
                interaction,
                "embed:field",
                "Add Embed Field",
                "fieldName",
                "Field Name",
                "",
                true,
                "fieldValue",
                "Field Value"
            );
        }

        // =========================
        // BUTTON
        // =========================

        if (id === "embed:button") {
            return showModal(
                interaction,
                "embed:button",
                "Add Button",
                "buttonLabel",
                "Button Label",
                "",
                false,
                "buttonId",
                "Custom ID / Action"
            );
        }

        // =========================
        // SELECT MENU
        // =========================

        if (id === "embed:select") {
            return showModal(
                interaction,
                "embed:select",
                "Add Select Menu",
                "customId",
                "Custom ID",
                "",
                false
            );
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.invalid(
                    "This embed builder action is invalid."
                )
            ],
            flags: 64
        });
    }
};

// =========================
// MODAL HELPER
// =========================

function showModal(
    interaction,
    customId,
    title,
    firstId,
    firstLabel,
    firstValue = "",
    required = true,
    secondId = null,
    secondLabel = null
) {
    const modal = new ModalBuilder()
        .setCustomId(customId)
        .setTitle(title);

    const firstInput = new TextInputBuilder()
        .setCustomId(firstId)
        .setLabel(firstLabel)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(required);

    if (firstValue) {
        firstInput.setValue(
            String(firstValue).slice(0, 4000)
        );
    }

    modal.addComponents(
        new ActionRowBuilder().addComponents(firstInput)
    );

    if (secondId && secondLabel) {
        const secondInput = new TextInputBuilder()
            .setCustomId(secondId)
            .setLabel(secondLabel)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(secondInput)
        );
    }

    return interaction.showModal(modal);
}
