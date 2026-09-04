const interactionEmbeds = require("../../embeds/general/interaction");
const {
    getSession
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "modal",

    async execute(client, interaction) {
        const session = getSession(
            interaction.user.id,
            interaction.guildId
        );

        if (!session) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalFailed(
                        "This embed builder session has expired."
                    )
                ],
                flags: 64
            });
        }

        const id = interaction.customId;

        // =========================
        // MESSAGE CONTENT
        // =========================

        if (id === "embed:content") {
            const content = interaction.fields.getTextInputValue(
                "content"
            );

            session.data.content = content;

            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "Message content updated."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // EMBED DESCRIPTION
        // =========================

        if (id === "embed:embed") {
            const description = interaction.fields.getTextInputValue(
                "description"
            );

            if (!session.data.embeds.length) {
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

            session.data.embeds[0].description = description;

            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "Embed description updated."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // FIELD
        // =========================

        if (id === "embed:field") {
            const name = interaction.fields.getTextInputValue(
                "fieldName"
            );

            const value = interaction.fields.getTextInputValue(
                "fieldValue"
            );

            if (!session.data.embeds.length) {
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

            const embed = session.data.embeds[0];

            if (!Array.isArray(embed.fields)) {
                embed.fields = [];
            }

            if (embed.fields.length >= 25) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This embed already has the maximum of 25 fields."
                        )
                    ],
                    flags: 64
                });
            }

            embed.fields.push({
                name: name.slice(0, 256),
                value: value.slice(0, 1024),
                inline: false
            });

            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "Embed field added."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // BUTTON
        // =========================

        if (id === "embed:button") {
            const label = interaction.fields.getTextInputValue(
                "buttonLabel"
            );

            const customId = interaction.fields.getTextInputValue(
                "buttonId"
            );

            if (!Array.isArray(session.data.buttons)) {
                session.data.buttons = [];
            }

            if (session.data.buttons.length >= 25) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "You cannot add more than 25 buttons."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.buttons.push({
                label: label.slice(0, 80),
                customId: customId.slice(0, 100),
                style: "secondary",
                emoji: "",
                disabled: false
            });

            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "Button added."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // SELECT MENU
        // =========================

        if (id === "embed:select") {
            const customId = interaction.fields.getTextInputValue(
                "customId"
            );

            if (!Array.isArray(session.data.selectMenus)) {
                session.data.selectMenus = [];
            }

            if (session.data.selectMenus.length >= 5) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "You cannot add more than 5 select menus."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.selectMenus.push({
                type: "string",
                customId: customId.slice(0, 100),
                placeholder: "Select an option",
                minValues: 1,
                maxValues: 1,
                disabled: false,
                options: []
            });

            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalSuccess(
                        "Select menu added."
                    )
                ],
                flags: 64
            });
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.modalInvalid(
                    "This embed editor action is invalid."
                )
            ],
            flags: 64
        });
    }
};
