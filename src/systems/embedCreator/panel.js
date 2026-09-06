const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// =========================
// HELPERS
// =========================

function getValue(
    value,
    fallback = "Not set"
) {
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
// MAIN PANEL
// =========================

function build(state) {
    const embed = state?.embed || {};

    const fields = Array.isArray(embed.fields)
        ? embed.fields.length
        : 0;

    const components = Array.isArray(state?.components)
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
                .setCustomId(
                    "embedCreator:content"
                )
                .setLabel("Content")
                .setEmoji("📝")
                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:embed"
                )
                .setLabel("Embed")
                .setEmoji("🎨")
                .setStyle(
                    ButtonStyle.Primary
                )
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:author"
                )
                .setLabel("Author")
                .setEmoji("👤")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:footer"
                )
                .setLabel("Footer")
                .setEmoji("🦶")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:media"
                )
                .setLabel("Media")
                .setEmoji("🖼️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:fields"
                )
                .setLabel("Fields")
                .setEmoji("📋")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:components"
                )
                .setLabel("Components")
                .setEmoji("🧩")
                .setStyle(
                    ButtonStyle.Secondary
                )
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:preview"
                )
                .setLabel("Preview")
                .setEmoji("👁️")
                .setStyle(
                    ButtonStyle.Success
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:save"
                )
                .setLabel("Save")
                .setEmoji("💾")
                .setStyle(
                    ButtonStyle.Success
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:send"
                )
                .setLabel("Send")
                .setEmoji("📤")
                .setStyle(
                    ButtonStyle.Success
                )
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:reset"
                )
                .setLabel("Reset")
                .setEmoji("🔄")
                .setStyle(
                    ButtonStyle.Danger
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:cancel"
                )
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(
                    ButtonStyle.Danger
                )
        )
    ];

    return {
        content: description,
        components: rows
    };
}

// =========================
// FIELD MANAGER
// =========================

function buildFields(state) {
    const fields = Array.isArray(
        state?.embed?.fields
    )
        ? state.embed.fields
        : [];

    const description = [
        "### 📋 Field Manager",
        "",
        `**Fields:** ${fields.length}`,
        ""
    ];

    if (!fields.length) {
        description.push(
            "No fields have been added yet."
        );
    } else {
        fields.forEach(
            (field, index) => {
                description.push(
                    `**${index + 1}.** ${getValue(
                        field.name,
                        "Unnamed"
                    )}`
                );

                description.push(
                    `└ ${getValue(
                        field.value,
                        "No value"
                    )}`
                );
            }
        );
    }

    const rows = [];

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:field:add"
                )
                .setLabel("Add Field")
                .setEmoji("➕")
                .setStyle(
                    ButtonStyle.Success
                )
                .setDisabled(
                    fields.length >= 25
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:field:manage"
                )
                .setLabel("Manage")
                .setEmoji("⚙️")
                .setStyle(
                    ButtonStyle.Primary
                )
                .setDisabled(
                    fields.length === 0
                )
        )
    );

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:fields:back"
                )
                .setLabel("Back")
                .setEmoji("↩️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    );

    return {
        content: description.join("\n"),
        components: rows
    };
}

// =========================
// COMPONENT MANAGER
// =========================

function buildComponents(state) {
    const components =
        Array.isArray(state?.components)
            ? state.components
            : [];

    const buttons = components.filter(
        component =>
            component?.type === "button"
    ).length;

    const selects = components.filter(
        component =>
            component?.type !== "button"
    ).length;

    const description = [
        "### 🧩 Components",
        "",
        `**Buttons:** ${buttons}`,
        `**Select Menus:** ${selects}`,
        `**Total:** ${components.length}`
    ].join("\n");

    const rows = [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:component:addButton"
                )
                .setLabel("Add Button")
                .setEmoji("🔘")
                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:component:addSelect"
                )
                .setLabel("Add Select Menu")
                .setEmoji("📋")
                .setStyle(
                    ButtonStyle.Primary
                )
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:component:manage"
                )
                .setLabel("Manage Components")
                .setEmoji("🗑️")
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    components.length === 0
                ),

            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:components:back"
                )
                .setLabel("Back")
                .setEmoji("↩️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    ];

    return {
        content: description,
        components: rows
    };
}

// =========================
// FIELD LIST
// =========================

function buildFieldList(state) {
    const fields = Array.isArray(
        state?.embed?.fields
    )
        ? state.embed.fields
        : [];

    const rows = [];

    if (fields.length) {
        for (
            let index = 0;
            index < fields.length && index < 25;
            index++
        ) {
            rows.push(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(
                            `embedCreator:field:select:${index}`
                        )
                        .setLabel(
                            `${index + 1}. ${String(
                                fields[index]?.name ||
                                    "Unnamed"
                            ).slice(0, 70)}`
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                )
            );
        }
    }

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:fields:back"
                )
                .setLabel("Back")
                .setEmoji("↩️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    );

    return {
        content:
            "### 📋 Select a field to manage.",
        components: rows.slice(0, 5)
    };
}

// =========================
// COMPONENT LIST
// =========================

function buildComponentList(state) {
    const components =
        Array.isArray(state?.components)
            ? state.components
            : [];

    const rows = [];

    components
        .slice(0, 20)
        .forEach(
            (component, index) => {
                const label =
                    component?.type === "button"
                        ? component.label ||
                          "Button"
                        : component?.type ||
                          "Select Menu";

                rows.push(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(
                                `embedCreator:component:select:${index}`
                            )
                            .setLabel(
                                `${index + 1}. ${String(
                                    label
                                ).slice(0, 70)}`
                            )
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                    )
                );
            }
        );

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:components:back"
                )
                .setLabel("Back")
                .setEmoji("↩️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    );

    return {
        content:
            "### 🧩 Select a component to manage.",
        components: rows.slice(0, 5)
    };
}

// =========================
// EXPORTS
// =========================

module.exports = {
    build,
    buildFields,
    buildComponents,
    buildFieldList,
    buildComponentList
};
