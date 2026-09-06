const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// =========================
// EMBED CREATOR PANEL
// =========================

function getValue(value, fallback = "Not set") {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return String(value);
}

// =========================
// BUILD PANEL
// =========================

function build(state) {
    const embed = state?.embed || {};

    const fields =
        Array.isArray(embed.fields)
            ? embed.fields.length
            : 0;

    const components =
        Array.isArray(state?.components)
            ? state.components.length
            : 0;

    const description = [
        "### 📝 Embed Creator",
        "",
        `**Content:** ${getValue(state?.content)}`,
        `**Title:** ${getValue(embed.title)}`,
        `**Description:** ${getValue(embed.description)}`,
        `**Color:** ${getValue(embed.color, "Default")}`,
        `**URL:** ${getValue(embed.url)}`,
        `**Author:** ${getValue(embed.author?.name)}`,
        `**Footer:** ${getValue(embed.footer?.text)}`,
        `**Thumbnail:** ${getValue(embed.thumbnail)}`,
        `**Image:** ${getValue(embed.image)}`,
        `**Fields:** ${fields}`,
        `**Components:** ${components}`
    ].join("\n");

    const rows = [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:content")
                .setLabel("Content")
                .setEmoji("📝")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("embedCreator:embed")
                .setLabel("Embed")
                .setEmoji("🎨")
                .setStyle(ButtonStyle.Primary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:author")
                .setLabel("Author")
                .setEmoji("👤")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("embedCreator:footer")
                .setLabel("Footer")
                .setEmoji("🦶")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("embedCreator:media")
                .setLabel("Media")
                .setEmoji("🖼️")
                .setStyle(ButtonStyle.Secondary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:fields")
                .setLabel("Fields")
                .setEmoji("📋")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("embedCreator:components")
                .setLabel("Components")
                .setEmoji("🧩")
                .setStyle(ButtonStyle.Secondary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:preview")
                .setLabel("Preview")
                .setEmoji("👁️")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("embedCreator:save")
                .setLabel("Save")
                .setEmoji("💾")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("embedCreator:send")
                .setLabel("Send")
                .setEmoji("📤")
                .setStyle(ButtonStyle.Success)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:reset")
                .setLabel("Reset")
                .setEmoji("🔄")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("embedCreator:cancel")
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
        )
    ];

    return {
        content: description,
        components: rows
    };
}

// =========================
// EXPORTS
// =========================

module.exports = {
    build
};
