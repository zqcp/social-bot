const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const interactionEmbeds =
    require("../../embeds/general/interaction");

const Embed =
    require("../../models/Embed");

const {
    getSession,
    buildMessage,
    deleteSession
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "button",

    async execute(client, interaction) {

        const session =
            getSession(
                interaction.user.id,
                interaction.guildId
            );

        if (!session) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.buttonFailed(
                        "This embed builder session has expired."
                    )
                ],
                flags: 64
            });
        }

        const id =
            interaction.customId;

        if (!id.startsWith("embed:")) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.buttonInvalid(
                        "This embed button action is invalid."
                    )
                ],
                flags: 64
            });
        }

        /*
         * CANCEL
         */

        if (id === "embed:cancel") {

            deleteSession(
                interaction.user.id,
                interaction.guildId
            );

            try {
                await interaction.update({
                    content: "Embed builder cancelled.",
                    embeds: [],
                    components: []
                });
            } catch {
                if (!interaction.replied) {
                    await interaction.reply({
                        content: "Embed builder cancelled.",
                        flags: 64
                    });
                }
            }

            return;
        }

        /*
         * PREVIEW
         */

        if (id === "embed:preview") {

            const data =
                buildMessage(
                    session,
                    interaction
                );

            return interaction.reply({
                content: data.content || undefined,
                embeds: data.embeds,
                components: data.components,
                flags: 64
            });
        }

        /*
         * SAVE
         */

        if (id === "embed:save") {

            try {

                await Embed.findOneAndUpdate(
                    {
                        guildId: interaction.guildId,
                        name: session.data.name
                    },
                    {
                        guildId: interaction.guildId,
                        name: session.data.name,
                        channelId: session.channelId || null,
                        content: session.data.content || "",
                        embeds: session.data.embeds || [],
                        buttons: session.data.buttons || [],
                        selectMenus:
                            session.data.selectMenus || [],
                        createdBy: interaction.user.id
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.buttonSuccess(
                            "Embed saved successfully."
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
                        interactionEmbeds.buttonFailed(
                            "The embed could not be saved."
                        )
                    ],
                    flags: 64
                });
            }
        }

        /*
         * SEND
         */

        if (id === "embed:send") {

            const data =
                buildMessage(
                    session,
                    interaction
                );

            if (
                !data.content &&
                !data.embeds.length &&
                !data.components.length
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.buttonFailed(
                            "There is nothing to send."
                        )
                    ],
                    flags: 64
                });
            }

            try {

                const channel =
                    client.channels.cache.get(
                        session.channelId
                    );

                if (!channel) {
                    return interaction.reply({
                        embeds: [
                            interactionEmbeds.buttonFailed(
                                "The editor channel could not be found."
                            )
                        ],
                        flags: 64
                    });
                }

                await channel.send(data);

                return interaction.reply({
                    embeds: [
                        interactionEmbeds.buttonSuccess(
                            "Embed sent successfully."
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
                        interactionEmbeds.buttonFailed(
                            "The embed could not be sent."
                        )
                    ],
                    flags: 64
                });
            }
        }

        /*
         * CONTENT
         */

        if (id === "embed:content") {

            return showModal(
                interaction,
                "embed:content",
                "Message Content",
                [
                    input(
                        "content",
                        "Content",
                        session.data.content || "",
                        TextInputStyle.Paragraph,
                        false
                    )
                ]
            );
        }

        /*
         * EMBED
         */

        if (id === "embed:embed") {

            const embed =
                getEmbed(session);

            return showModal(
                interaction,
                "embed:embed",
                "Embed",
                [
                    input(
                        "title",
                        "Title",
                        embed.title || "",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "description",
                        "Description",
                        embed.description || "",
                        TextInputStyle.Paragraph,
                        false
                    ),

                    input(
                        "url",
                        "URL",
                        embed.url || "",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "color",
                        "Color",
                        embed.color || "",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "timestamp",
                        "Timestamp",
                        embed.timestamp === true
                            ? "true"
                            : embed.timestamp || "",
                        TextInputStyle.Short,
                        false
                    )
                ]
            );
        }

        /*
         * FIELDS
         */

        if (id === "embed:field") {

            const fields =
                getEmbed(session).fields || [];

            return showModal(
                interaction,
                "embed:field",
                "Add Field",
                [
                    input(
                        "fieldName",
                        "Field Name",
                        "",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "fieldValue",
                        "Field Value",
                        "",
                        TextInputStyle.Paragraph,
                        true
                    ),

                    input(
                        "fieldInline",
                        "Inline",
                        "false",
                        TextInputStyle.Short,
                        true
                    )
                ]
            );
        }

        /*
         * BUTTONS
         */

        if (id === "embed:button") {

            return showModal(
                interaction,
                "embed:button",
                "Add Button",
                [
                    input(
                        "buttonLabel",
                        "Label",
                        "",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "buttonId",
                        "Custom ID",
                        "",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "buttonStyle",
                        "Style",
                        "secondary",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "buttonUrl",
                        "URL",
                        "",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "buttonEmoji",
                        "Emoji",
                        "",
                        TextInputStyle.Short,
                        false
                    )
                ]
            );
        }

        /*
         * SELECT MENUS
         */

        if (id === "embed:select") {

            return showModal(
                interaction,
                "embed:select",
                "Add Select Menu",
                [
                    input(
                        "customId",
                        "Custom ID",
                        "",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "placeholder",
                        "Placeholder",
                        "Select an option",
                        TextInputStyle.Short,
                        false
                    ),

                    input(
                        "type",
                        "Type",
                        "string",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "minValues",
                        "Minimum Values",
                        "1",
                        TextInputStyle.Short,
                        true
                    ),

                    input(
                        "maxValues",
                        "Maximum Values",
                        "1",
                        TextInputStyle.Short,
                        true
                    )
                ]
            );
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.buttonInvalid(
                    "This embed button action is invalid."
                )
            ],
            flags: 64
        });
    }
};

function input(
    customId,
    label,
    value,
    style,
    required
) {
    const component =
        new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(style)
            .setRequired(required);

    if (value) {
        component.setValue(
            String(value).slice(0, 4000)
        );
    }

    return component;
}

async function showModal(
    interaction,
    customId,
    title,
    inputs
) {
    const modal =
        new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title);

    for (const component of inputs) {
        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(component)
        );
    }

    return interaction.showModal(modal);
}

function getEmbed(session) {

    if (!Array.isArray(session.data.embeds)) {
        session.data.embeds = [];
    }

    if (!session.data.embeds[0]) {
        session.data.embeds.push({
            title: "",
            description: "",
            url: "",
            color: "",
            author: {
                name: "",
                url: "",
                iconURL: ""
            },
            thumbnail: "",
            image: "",
            footer: {
                text: "",
                iconURL: ""
            },
            timestamp: false,
            fields: []
        });
    }

    if (!Array.isArray(session.data.embeds[0].fields)) {
        session.data.embeds[0].fields = [];
    }

    return session.data.embeds[0];
}
