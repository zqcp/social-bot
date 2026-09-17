const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");

function value(value, fallback = "Not set") {
    return value || fallback;
}

function build(state) {
    const embed = new EmbedBuilder()
        .setTitle("Embed Creator")
        .setDescription(
            [
                `> Content: ${value(state.content)}`,
                `> Title: ${value(state.embed?.title)}`,
                `> Description: ${value(state.embed?.description)}`,
                `> Color: ${value(state.embed?.color)}`,
                `> URL: ${value(state.embed?.url)}`,
                `> Author: ${value(state.embed?.author?.name)}`,
                `> Thumbnail: ${value(state.embed?.thumbnail)}`,
                `> Image: ${value(state.embed?.image)}`,
                `> Footer: ${value(state.embed?.footer?.text)}`,
                `> Fields: ${state.embed?.fields?.length || 0}`,
                `> Timestamp: ${state.embed?.timestamp ? "Enabled" : "Disabled"}`
            ].join("\n")
        );

    const select = new StringSelectMenuBuilder()
        .setCustomId("embedCreator:edit")
        .setPlaceholder("Select an embed setting")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Content")
                .setValue("content"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Title")
                .setValue("title"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Description")
                .setValue("description"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Color")
                .setValue("color"),
            new StringSelectMenuOptionBuilder()
                .setLabel("URL")
                .setValue("url"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Author")
                .setValue("author"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Thumbnail")
                .setValue("thumbnail"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Image")
                .setValue("image"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Footer")
                .setValue("footer"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Fields")
                .setValue("fields"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Timestamp")
                .setValue("timestamp")
        );

    const selectRow = new ActionRowBuilder()
        .addComponents(select);

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:preview")
                .setLabel("Preview")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("embedCreator:save")
                .setLabel("Save")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("embedCreator:send")
                .setLabel("Send")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("embedCreator:reset")
                .setLabel("Reset")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("embedCreator:cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
        );

    return {
        embeds: [embed],
        components: [selectRow, buttons]
    };
}

function buildFields(state) {
    const fields = state.embed?.fields || [];

    const embed = new EmbedBuilder()
        .setTitle("Embed Fields")
        .setDescription(
            [
                `> Fields: ${fields.length}`,
                "",
                fields.length
                    ? fields
                        .map(
                            (field, index) =>
                                `> ${index + 1}. ${value(field.name)} — ${value(field.value)}`
                        )
                        .join("\n")
                    : "> No fields added."
            ].join("\n")
        );

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:field:add")
                .setLabel("Add Field")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("embedCreator:field:back")
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary)
        );

    return {
        embeds: [embed],
        components: [buttons]
    };
}

function buildComponents(state) {
    const components = state.components || [];

    const embed = new EmbedBuilder()
        .setTitle("Embed Components")
        .setDescription(
            [
                `> Components: ${components.length}`,
                "",
                components.length
                    ? components
                        .map(
                            (component, index) =>
                                `> ${index + 1}. ${value(component.type)}`
                        )
                        .join("\n")
                    : "> No components added."
            ].join("\n")
        );

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:component:add")
                .setLabel("Add Component")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("embedCreator:component:back")
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary)
        );

    return {
        embeds: [embed],
        components: [buttons]
    };
}

function buildFieldList(state) {
    const fields = state.embed?.fields || [];

    const embed = new EmbedBuilder()
        .setTitle("Manage Fields")
        .setDescription(
            [
                `> Fields: ${fields.length}`,
                "",
                fields.length
                    ? fields
                        .map(
                            (field, index) =>
                                `> ${index + 1}. ${value(field.name)} — ${value(field.value)}`
                        )
                        .join("\n")
                    : "> No fields added."
            ].join("\n")
        );

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:field:add")
                .setLabel("Add Field")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("embedCreator:field:back")
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary)
        );

    return {
        embeds: [embed],
        components: [buttons]
    };
}

function buildComponentList(state) {
    const components = state.components || [];

    const embed = new EmbedBuilder()
        .setTitle("Manage Components")
        .setDescription(
            [
                `> Components: ${components.length}`,
                "",
                components.length
                    ? components
                        .map(
                            (component, index) =>
                                `> ${index + 1}. ${value(component.type)}`
                        )
                        .join("\n")
                    : "> No components added."
            ].join("\n")
        );

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("embedCreator:component:add")
                .setLabel("Add Component")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("embedCreator:component:back")
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary)
        );

    return {
        embeds: [embed],
        components: [buttons]
    };
}

module.exports = {
    build,
    buildFields,
    buildComponents,
    buildFieldList,
    buildComponentList
};
