const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const builder = require("../../systems/embed/builder");

function input(id, label, style = TextInputStyle.Short, required = false) {
    return new ActionRowBuilder().addComponents(
        new TextInputBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
            .setRequired(required)
    );
}

function modal(id, title, inputs) {
    return new ModalBuilder()
        .setCustomId(id)
        .setTitle(title)
        .addComponents(...inputs);
}

module.exports = {
    name: "embed",
    type: "button",

    async execute(client, interaction) {
        if (!interaction.customId.startsWith("embed:")) return;

        const session = builder.getSession(
            interaction.user.id,
            interaction.guildId
        );

        if (!session) {
            return interaction.reply({
                content: "Your embed builder session has expired.",
                flags: 64
            });
        }

        const action = interaction.customId.split(":")[1];

        if (action === "content") {
            return interaction.showModal(
                modal("embedModal:content", "Message Content", [
                    input(
                        "content",
                        "Message content",
                        TextInputStyle.Paragraph
                    )
                ])
            );
        }

        if (action === "embed") {
            return interaction.showModal(
                modal("embedModal:embed", "Embed", [
                    input("title", "Title"),
                    input(
                        "description",
                        "Description",
                        TextInputStyle.Paragraph
                    ),
                    input("color", "Color")
                ])
            );
        }

        if (action === "field") {
            return interaction.showModal(
                modal("embedModal:field", "Add Field", [
                    input("name", "Field name", TextInputStyle.Short, true),
                    input(
                        "value",
                        "Field value",
                        TextInputStyle.Paragraph,
                        true
                    ),
                    input("inline", "Inline? (yes/no)")
                ])
            );
        }

        if (action === "button") {
            return interaction.showModal(
                modal("embedModal:button", "Add Button", [
                    input("label", "Button label"),
                    input("customId", "Custom ID", TextInputStyle.Short, true),
                    input("style", "Style (primary/secondary/success/danger/link)")
                ])
            );
        }

        if (action === "select") {
            return interaction.showModal(
                modal("embedModal:select", "Add Select Menu", [
                    input(
                        "customId",
                        "Custom ID",
                        TextInputStyle.Short,
                        true
                    ),
                    input(
                        "type",
                        "Type (string/user/role/mentionable/channel)",
                        TextInputStyle.Short,
                        true
                    ),
                    input("placeholder", "Placeholder")
                ])
            );
        }

        if (action === "preview") {
            const embeds = builder.buildEmbeds(
                session.data.embeds || [],
                interaction
            );

            const components = [
                ...builder.buildButtons(
                    session.data.buttons || [],
                    value => builder.replaceVariables(value, interaction)
                )
            ];

            return interaction.reply({
                content: session.data.content
                    ? builder.replaceVariables(
                        session.data.content,
                        interaction
                    )
                    : undefined,
                embeds,
                components,
                flags: 64
            });
        }

        if (action === "cancel") {
            builder.deleteSession(
                interaction.user.id,
                interaction.guildId
            );

            return interaction.update({
                content: "Embed builder cancelled.",
                embeds: [],
                components: []
            });
        }
    }
};
