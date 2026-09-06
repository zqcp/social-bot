const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
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
    const input =
        new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(style)
            .setRequired(required);

    if (value !== null && value !== undefined) {
        input.setValue(String(value).slice(0, 4000));
    }

    if (placeholder) {
        input.setPlaceholder(
            String(placeholder).slice(0, 100)
        );
    }

    return new ActionRowBuilder().addComponents(
        input
    );
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
                "Enter message content...",
                TextInputStyle.Paragraph,
                false
            )
        );
}

// =========================
// EMBED MODAL
// =========================

function embed(state) {
    const data = state?.embed || {};

    return new ModalBuilder()
        .setCustomId("embedCreator:embed")
        .setTitle("Edit Embed")
        .addComponents(
            textInput(
                "title",
                "Title",
                data.title || "",
                "Enter an embed title...",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "description",
                "Description",
                data.description || "",
                "Enter an embed description...",
                TextInputStyle.Paragraph,
                false
            ),

            textInput(
                "color",
                "Color",
                data.color || "",
                "#5865F2 or 5865F2",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "url",
                "URL",
                data.url || "",
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
    const data =
        state?.embed?.author || {};

    return new ModalBuilder()
        .setCustomId("embedCreator:author")
        .setTitle("Edit Author")
        .addComponents(
            textInput(
                "name",
                "Name",
                data.name || "",
                "Enter author name...",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "iconURL",
                "Icon URL",
                data.iconURL || "",
                "https://example.com/icon.png",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "url",
                "URL",
                data.url || "",
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
    const data =
        state?.embed?.footer || {};

    return new ModalBuilder()
        .setCustomId("embedCreator:footer")
        .setTitle("Edit Footer")
        .addComponents(
            textInput(
                "text",
                "Text",
                data.text || "",
                "Enter footer text...",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "iconURL",
                "Icon URL",
                data.iconURL || "",
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
    const data = state?.embed || {};

    return new ModalBuilder()
        .setCustomId("embedCreator:media")
        .setTitle("Edit Media")
        .addComponents(
            textInput(
                "thumbnail",
                "Thumbnail URL",
                data.thumbnail || "",
                "https://example.com/thumbnail.png",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "image",
                "Image URL",
                data.image || "",
                "https://example.com/image.png",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// FIELD MODAL
// =========================

function field(fieldData = {}) {
    return new ModalBuilder()
        .setCustomId("embedCreator:field")
        .setTitle("Add Field")
        .addComponents(
            textInput(
                "name",
                "Field Name",
                fieldData.name || "",
                "Enter field name...",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "value",
                "Field Value",
                fieldData.value || "",
                "Enter field value...",
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
// FIELD EDIT MODAL
// =========================

function editField(
    index,
    fieldData = {}
) {
    return new ModalBuilder()
        .setCustomId(
            `embedCreator:field:edit:${index}`
        )
        .setTitle("Edit Field")
        .addComponents(
            textInput(
                "name",
                "Field Name",
                fieldData.name || "",
                "Enter field name...",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "value",
                "Field Value",
                fieldData.value || "",
                "Enter field value...",
                TextInputStyle.Paragraph,
                true
            ),

            textInput(
                "inline",
                "Inline",
                fieldData.inline
                    ? "true"
                    : "false",
                "true or false",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// BUTTON MODAL
// =========================

function button(data = {}) {
    return new ModalBuilder()
        .setCustomId(
            data.index !== undefined
                ? `embedCreator:component:button:edit:${data.index}`
                : "embedCreator:component:button"
        )
        .setTitle(
            data.index !== undefined
                ? "Edit Button"
                : "Add Button"
        )
        .addComponents(
            textInput(
                "label",
                "Label",
                data.label || "",
                "Button label...",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "style",
                "Style",
                data.style || "primary",
                "primary, secondary, success, danger, link",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "emoji",
                "Emoji",
                data.emoji || "",
                "Optional emoji",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "customId",
                "Custom ID",
                data.customId || "",
                "Required unless using a link button",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "url",
                "URL",
                data.url || "",
                "Required for link buttons",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// SELECT MENU MODAL
// =========================

function select(data = {}) {
    return new ModalBuilder()
        .setCustomId(
            data.index !== undefined
                ? `embedCreator:component:select:edit:${data.index}`
                : "embedCreator:component:select"
        )
        .setTitle(
            data.index !== undefined
                ? "Edit Select Menu"
                : "Add Select Menu"
        )
        .addComponents(
            textInput(
                "type",
                "Type",
                data.type || "string",
                "string, user, role, channel, mentionable",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "customId",
                "Custom ID",
                data.customId || "",
                "Enter a custom ID...",
                TextInputStyle.Short,
                true
            ),

            textInput(
                "placeholder",
                "Placeholder",
                data.placeholder || "",
                "Choose an option...",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "minValues",
                "Minimum Values",
                data.minValues ?? "1",
                "0-25",
                TextInputStyle.Short,
                false
            ),

            textInput(
                "maxValues",
                "Maximum Values",
                data.maxValues ?? "1",
                "1-25",
                TextInputStyle.Short,
                false
            )
        );
}

// =========================
// SAVE MODAL
// =========================

function save(name = "") {
    return new ModalBuilder()
        .setCustomId("embedCreator:save")
        .setTitle("Save Embed")
        .addComponents(
            textInput(
                "name",
                "Embed Name",
                name,
                "Enter a name for this embed...",
                TextInputStyle.Short,
                true
            )
        );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    textInput,

    content,
    embed,
    author,
    footer,
    media,

    field,
    editField,

    button,
    select,

    save
};
