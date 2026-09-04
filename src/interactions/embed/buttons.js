const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const Embed =
    require("../../models/Embed");

const interactionEmbeds =
    require("../../embeds/general/interaction");

const {
    getSession,
    deleteSession,
    buildMessage
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

            const data =
                buildMessage(
                    session,
                    interaction
                );

            if (
                !data.embeds.length &&
                !data.content
            ) {
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
                content: data.content,
                embeds: data.embeds,
                components: data.components,
                flags: 64
            });
        }

        // =========================
        // SAVE
        // =========================

        if (id === "embed:save") {

            if (!session.data.name) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This embed does not have a name."
                        )
                    ],
                    flags: 64
                });
            }

            try {

                await Embed.findOneAndUpdate(
                    {
                        guildId:
                            session.guildId,

                        name:
                            session.data.name
                    },
                    {
                        guildId:
                            session.guildId,

                        name:
                            session.data.name,

                        channelId:
                            session.channelId,

                        content:
                            session.data.content || "",

                        embeds:
                            session.data.embeds || [],

                        buttons:
                            session.data.buttons || [],

                        selectMenus:
                            session.data.selectMenus || [],

                        createdBy:
                            session.userId
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalSuccess(
                            "The embed has been saved."
                        )
                    ],
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[EMBED SAVE]",
                    error
                );

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "I couldn't save this embed."
                        )
                    ],
                    flags: 64
                });
            }
        }

        // =========================
        // SEND
        // =========================

        if (id === "embed:send") {

            const data =
                buildMessage(
                    session,
                    interaction
                );

            if (
                !data.embeds.length &&
                !data.content
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.invalid(
                            "There is nothing to send yet."
                        )
                    ],
                    flags: 64
                });
            }

            const channel =
                interaction.guild.channels.cache.get(
                    session.channelId
                );

            if (!channel) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.invalid(
                            "The embed channel could not be found."
                        )
                    ],
                    flags: 64
                });
            }

            try {

                await channel.send(data);

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalSuccess(
                            "The embed has been sent."
                        )
                    ],
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[EMBED SEND]",
                    error
                );

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "I couldn't send the embed."
                        )
                    ],
                    flags: 64
                });
            }
        }

        // =========================
        // CONTENT
        // =========================

        if (id === "embed:content") {

            return showModal(
                interaction,
                "embed:content",
                "Message Content",
                "content",
                "Content",
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
                "Embed",
                "title",
                "Title",
                session.data.embeds[0]?.title || "",
                false,
                "description",
                "Description"
            );
        }

        // =========================
        // FIELDS
        // =========================

        if (id === "embed:field") {

            return showModal(
                interaction,
                "embed:field",
                "Embed Fields",
                "fieldName",
                "Field Name",
                "",
                true,
                "fieldValue",
                "Field Value"
            );
        }

        // =========================
        // BUTTONS
        // =========================

        if (id === "embed:button") {

            return showModal(
                interaction,
                "embed:button",
                "Embed Buttons",
                "buttonLabel",
                "Button Label",
                "",
                true,
                "buttonId",
                "Button Custom ID"
            );
        }

        // =========================
        // SELECT MENUS
        // =========================

        if (id === "embed:select") {

            return showModal(
                interaction,
                "embed:select",
                "Select Menus",
                "customId",
                "Select Menu Custom ID",
                "",
                true
            );
        }

        // =========================
        // INVALID
        // =========================

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
// MODAL BUILDER
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

    const modal =
        new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title);

    const firstInput =
        new TextInputBuilder()
            .setCustomId(firstId)
            .setLabel(firstLabel)
            .setStyle(
                TextInputStyle.Paragraph
            )
            .setRequired(required);

    if (firstValue) {
        firstInput.setValue(
            String(firstValue).slice(0, 4000)
        );
    }

    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(firstInput)
    );

    if (
        secondId &&
        secondLabel
    ) {

        const secondInput =
            new TextInputBuilder()
                .setCustomId(secondId)
                .setLabel(secondLabel)
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(secondInput)
        );
    }

    return interaction.showModal(modal);
}
