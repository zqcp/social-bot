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
                content:
                    data.content,

                embeds:
                    data.embeds,

                components:
                    data.components,

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
                [
                    {
                        id: "content",
                        label: "Content",
                        value:
                            session.data.content || "",
                        style:
                            TextInputStyle.Paragraph,
                        required: false
                    }
                ]
            );
        }

        // =========================
        // EMBED
        // =========================

        if (id === "embed:embed") {

            const current =
                session.data.embeds?.[0] || {};

            return showModal(
                interaction,
                "embed:embed",
                "Embed Settings",
                [
                    {
                        id: "title",
                        label: "Title",
                        value:
                            current.title || "",
                        required: false
                    },
                    {
                        id: "description",
                        label: "Description",
                        value:
                            current.description || "",
                        style:
                            TextInputStyle.Paragraph,
                        required: false
                    },
                    {
                        id: "url",
                        label: "URL",
                        value:
                            current.url || "",
                        required: false
                    },
                    {
                        id: "color",
                        label: "Color",
                        value:
                            current.color || "",
                        required: false
                    },
                    {
                        id: "timestamp",
                        label: "Timestamp",
                        value:
                            current.timestamp
                                ? String(
                                    current.timestamp
                                )
                                : "",
                        required: false
                    }
                ]
            );
        }

        // =========================
        // FIELDS
        // =========================

        if (id === "embed:field") {

            return showModal(
                interaction,
                "embed:field",
                "Embed Field",
                [
                    {
                        id: "fieldName",
                        label: "Field Name",
                        required: true
                    },
                    {
                        id: "fieldValue",
                        label: "Field Value",
                        style:
                            TextInputStyle.Paragraph,
                        required: true
                    },
                    {
                        id: "fieldInline",
                        label: "Inline",
                        value: "false",
                        required: false
                    }
                ]
            );
        }

        // =========================
        // BUTTONS
        // =========================

        if (id === "embed:button") {

            return showModal(
                interaction,
                "embed:button",
                "Embed Button",
                [
                    {
                        id: "buttonLabel",
                        label: "Button Label",
                        required: true
                    },
                    {
                        id: "buttonId",
                        label: "Button Custom ID",
                        required: false
                    },
                    {
                        id: "buttonStyle",
                        label: "Button Style",
                        value: "secondary",
                        required: false
                    },
                    {
                        id: "buttonUrl",
                        label: "Button URL",
                        required: false
                    },
                    {
                        id: "buttonEmoji",
                        label: "Button Emoji",
                        required: false
                    }
                ]
            );
        }

        // =========================
        // SELECT MENUS
        // =========================

        if (id === "embed:select") {

            return showModal(
                interaction,
                "embed:select",
                "Select Menu",
                [
                    {
                        id: "customId",
                        label: "Custom ID",
                        required: true
                    },
                    {
                        id: "placeholder",
                        label: "Placeholder",
                        value:
                            "Select an option",
                        required: false
                    },
                    {
                        id: "type",
                        label: "Type",
                        value: "string",
                        required: false
                    },
                    {
                        id: "minValues",
                        label: "Minimum Values",
                        value: "1",
                        required: false
                    },
                    {
                        id: "maxValues",
                        label: "Maximum Values",
                        value: "1",
                        required: false
                    }
                ]
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
    inputs = []
) {

    const modal =
        new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title);

    for (
        const inputData of inputs.slice(0, 5)
    ) {

        const input =
            new TextInputBuilder()
                .setCustomId(
                    inputData.id
                )
                .setLabel(
                    inputData.label
                )
                .setStyle(
                    inputData.style ||
                    TextInputStyle.Short
                )
                .setRequired(
                    Boolean(
                        inputData.required
                    )
                );

        if (
            inputData.value !== undefined &&
            inputData.value !== null
        ) {
            input.setValue(
                String(
                    inputData.value
                ).slice(0, 4000)
            );
        }

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(input)
        );
    }

    return interaction.showModal(
        modal
    );
}
