const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// =========================
// TEXT INPUT
// =========================

function textInput(
    customId,
    label,
    value = "",
    placeholder = "",
    style = TextInputStyle.Short,
    required = false
) {
    const input = new TextInputBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
        .setRequired(required);

    if (value) {
        input.setValue(
            String(value)
        );
    }

    if (placeholder) {
        input.setPlaceholder(
            placeholder
        );
    }

    return new ActionRowBuilder()
        .addComponents(input);
}

// =========================
// CONTENT MODAL
// =========================

function content(state) {
    return new ModalBuilder()
        .setCustomId("embedCreator:content")
        .setTitle("Edit Content")
        .addComponents(
            textInput(
                "content",
                "Message Content",
                state?.content || "",
                "Enter message content",
                TextInputStyle.Paragraph,
                false
            )
        );
}

// =========================
// EMBED MODAL
// =========================

function embed(state) {
    return new ModalBuilder()
        .setCustomId("embedCreator:embed")
        .setTitle("Edit Embed")
        .addComponents(
            textInput(
                "title",
                "Title",
                state?.embed?.title || "",
                "Enter an embed title",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "description",
                "Description",
                state?.embed?.description || "",
                "Enter an embed description",
                TextInputStyle.Paragraph,
                false
            ),

            textInput(
                "color",
                "Color",
                state?.embed?.color || "",
                "#5865F2 or default",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "url",
                "URL",
                state?.embed?.url || "",
                "https://example.com",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// AUTHOR MODAL
// =========================

function author(state) {
    return new ModalBuilder()
        .setCustomId("embedCreator:author")
        .setTitle("Edit Author")
        .addComponents(
            textInput(
                "name",
                "Author Name",
                state?.embed?.author?.name || "",
                "Enter author name",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "iconURL",
                "Icon URL",
                state?.embed?.author?.iconURL || "",
                "https://example.com/icon.png",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "url",
                "Author URL",
                state?.embed?.author?.url || "",
                "https://example.com",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// FOOTER MODAL
// =========================

function footer(state) {
    return new ModalBuilder()
        .setCustomId("embedCreator:footer")
        .setTitle("Edit Footer")
        .addComponents(
            textInput(
                "text",
                "Footer Text",
                state?.embed?.footer?.text || "",
                "Enter footer text",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "iconURL",
                "Icon URL",
                state?.embed?.footer?.iconURL || "",
                "https://example.com/icon.png",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// MEDIA MODAL
// =========================

function media(state) {
    return new ModalBuilder()
        .setCustomId("embedCreator:media")
        .setTitle("Edit Media")
        .addComponents(
            textInput(
                "thumbnail",
                "Thumbnail URL",
                state?.embed?.thumbnail || "",
                "https://example.com/thumbnail.png",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "image",
                "Image URL",
                state?.embed?.image || "",
                "https://example.com/image.png",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// FIELD MODAL
// =========================

function field(
    fieldData = {}
) {
    return new ModalBuilder()
        .setCustomId("embedCreator:field")
        .setTitle("Add Field")
        .addComponents(
            textInput(
                "name",
                "Field Name",
                fieldData.name || "",
                "Enter field name",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "value",
                "Field Value",
                fieldData.value || "",
                "Enter field value",
                TextInputStyle.Paragraph,
                true
            ),

            textInput(
                "inline",
                "Inline",
                fieldData.inline ? "true" : "false",
                "true or false",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// SAVE MODAL
// =========================

function save(
    name = ""
) {
    return new ModalBuilder()
        .setCustomId("embedCreator:save")
        .setTitle("Save Embed")
        .addComponents(
            textInput(
                "name",
                "Embed Name",
                name,
                "Enter a name for this embed",
                TextInputStyle.Short,
                true
            )
        );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    content,
    embed,
    author,
    footer,
    media,
    field,
    save
};
