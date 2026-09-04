const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const builder =
    require("../../systems/embed/builder");

const fields =
    require("../../systems/embed/fields");

const buttons =
    require("../../systems/embed/buttons");

const selectMenus =
    require("../../systems/embed/selectMenus");

const globalEmbeds =
    require("../../embeds/general/global");


// ============================================================
// HELPERS
// ============================================================

function getSession(interaction) {
    return builder.getSession(
        interaction.user.id,
        interaction.guildId
    );
}

function input(
    customId,
    label,
    value = "",
    style = TextInputStyle.Short,
    required = false,
    maxLength = 4000
) {
    const field =
        new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(style)
            .setRequired(required)
            .setMaxLength(maxLength);

    if (value !== undefined && value !== null) {
        field.setValue(String(value).slice(0, maxLength));
    }

    return new ActionRowBuilder().addComponents(field);
}

function showError(interaction, text) {
    return interaction.reply({
        embeds: [
            globalEmbeds.error(text)
        ],
        flags: 64
    });
}


// ============================================================
// MODAL BUILDER
// ============================================================

function contentModal(session) {

    return new ModalBuilder()
        .setCustomId("embed:modal:content")
        .setTitle("Edit Content")
        .addComponents(
            input(
                "content",
                "Content",
                session.data.content || "",
                TextInputStyle.Paragraph,
                false,
                2000
            )
        );
}


function embedPropertyModal(session, property) {

    const index =
        Number(session.data.activeEmbed) || 0;

    const embed =
        session.data.embeds[index];

    if (!embed) return null;

    const values = {
        title: embed.title || "",
        description: embed.description || "",
        url: embed.url || "",
        color: embed.color || "",
        author: embed.author?.name || "",
        thumbnail: embed.thumbnail || "",
        image: embed.image || "",
        footer: embed.footer?.text || ""
    };

    const settings = {
        title: {
            label: "Title",
            style: TextInputStyle.Short,
            max: 256
        },
        description: {
            label: "Description",
            style: TextInputStyle.Paragraph,
            max: 4000
        },
        url: {
            label: "URL",
            style: TextInputStyle.Short,
            max: 2048
        },
        color: {
            label: "Color",
            style: TextInputStyle.Short,
            max: 20
        },
        author: {
            label: "Author Name",
            style: TextInputStyle.Short,
            max: 256
        },
        thumbnail: {
            label: "Thumbnail URL",
            style: TextInputStyle.Short,
            max: 2048
        },
        image: {
            label: "Image URL",
            style: TextInputStyle.Short,
            max: 2048
        },
        footer: {
            label: "Footer Text",
            style: TextInputStyle.Short,
            max: 2048
        }
    };

    const setting =
        settings[property];

    if (!setting) return null;

    return new ModalBuilder()
        .setCustomId(
            `embed:modal:${property}`
        )
        .setTitle(
            `Edit ${setting.label}`
        )
        .addComponents(
            input(
                "value",
                setting.label,
                values[property],
                setting.style,
                false,
                setting.max
            )
        );
}


function authorModal(session) {

    const index =
        Number(session.data.activeEmbed) || 0;

    const author =
        session.data.embeds[index]?.author || {};

    return new ModalBuilder()
        .setCustomId("embed:modal:author")
        .setTitle("Edit Author")
        .addComponents(
            input(
                "name",
                "Author Name",
                author.name || "",
                TextInputStyle.Short,
                false,
                256
            ),
            input(
                "url",
                "Author URL",
                author.url || "",
                TextInputStyle.Short,
                false,
                2048
            ),
            input(
                "icon",
                "Author Icon URL",
                author.iconURL || "",
                TextInputStyle.Short,
                false,
                2048
            )
        );
}


function footerModal(session) {

    const index =
        Number(session.data.activeEmbed) || 0;

    const footer =
        session.data.embeds[index]?.footer || {};

    return new ModalBuilder()
        .setCustomId("embed:modal:footer")
        .setTitle("Edit Footer")
        .addComponents(
            input(
                "text",
                "Footer Text",
                footer.text || "",
                TextInputStyle.Short,
                false,
                2048
            ),
            input(
                "icon",
                "Footer Icon URL",
                footer.iconURL || "",
                TextInputStyle.Short,
                false,
                2048
            )
        );
}


function fieldModal(session, mode) {

    const index =
        Number(session.data.activeField) || 0;

    const field =
        session.data.embeds[
            Number(session.data.activeEmbed) || 0
        ]?.fields?.[index] || {};

    return new ModalBuilder()
        .setCustomId(
            `embed:modal:field:${mode}`
        )
        .setTitle(
            mode === "add"
                ? "Add Field"
                : "Edit Field"
        )
        .addComponents(
            input(
                "name",
                "Field Name",
                field.name || "",
                TextInputStyle.Short,
                true,
                256
            ),
            input(
                "value",
                "Field Value",
                field.value || "",
                TextInputStyle.Paragraph,
                true,
                1024
            ),
            input(
                "inline",
                "Inline",
                field.inline ? "Yes" : "No",
                TextInputStyle.Short,
                true,
                3
            )
        );
}


function buttonModal(session, mode) {

    const index =
        Number(session.data.activeButton) || 0;

    const button =
        session.data.buttons[index] || {};

    return new ModalBuilder()
        .setCustomId(
            `embed:modal:button:${mode}`
        )
        .setTitle(
            mode === "add"
                ? "Add Button"
                : "Edit Button"
        )
        .addComponents(
            input(
                "label",
                "Label",
                button.label || "",
                TextInputStyle.Short,
                false,
                80
            ),
            input(
                "style",
                "Style",
                button.style || "secondary",
                TextInputStyle.Short,
                true,
                10
            ),
            input(
                "customId",
                "Custom ID",
                button.customId || "",
                TextInputStyle.Short,
                false,
                100
            ),
            input(
                "emoji",
                "Emoji",
                button.emoji || "",
                TextInputStyle.Short,
                false,
                100
            ),
            input(
                "url",
                "URL",
                button.url || "",
                TextInputStyle.Short,
                false,
                2048
            )
        );
}


function selectMenuModal(session) {

    const index =
        Number(session.data.activeSelectMenu) || 0;

    const menu =
        session.data.selectMenus[index] || {};

    return new ModalBuilder()
        .setCustomId("embed:modal:select-menu")
        .setTitle("Edit Select Menu")
        .addComponents(
            input(
                "type",
                "Type",
                menu.type || "string",
                TextInputStyle.Short,
                true,
                20
            ),
            input(
                "customId",
                "Custom ID",
                menu.customId || "",
                TextInputStyle.Short,
                true,
                100
            ),
            input(
                "placeholder",
                "Placeholder",
                menu.placeholder || "",
                TextInputStyle.Short,
                false,
                150
            ),
            input(
                "min",
                "Minimum Values",
                menu.minValues ?? 1,
                TextInputStyle.Short,
                true,
                2
            ),
            input(
                "max",
                "Maximum Values",
                menu.maxValues ?? 1,
                TextInputStyle.Short,
                true,
                2
            )
        );
}


function moveModal(type) {

    return new ModalBuilder()
        .setCustomId(
            `embed:modal:move:${type}`
        )
        .setTitle(
            `Move ${type}`
        )
        .addComponents(
            input(
                "position",
                "New Position",
                "1",
                TextInputStyle.Short,
                true,
                3
            )
        );
}


// ============================================================
// EXECUTE
// ============================================================

module.exports = {

    name: "embedModals",

    async execute(interaction) {

        if (!interaction.isModalSubmit()) {
            return;
        }

        if (!interaction.customId.startsWith("embed:")) {
            return;
        }

        const session =
            getSession(interaction);

        if (!session) {
            return showError(
                interaction,
                "This embed editor session has expired."
            );
        }

        const id =
            interaction.customId;


        // ====================================================
        // CONTENT
        // ====================================================

        if (id === "embed:modal:content") {

            session.data.content =
                interaction.fields.getTextInputValue(
                    "content"
                );

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Content updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // EMBED PROPERTIES
        // ====================================================

        const propertyMatch =
            id.match(
                /^embed:modal:(title|description|url|color|thumbnail|image)$/
            );

        if (propertyMatch) {

            const property =
                propertyMatch[1];

            const index =
                Number(session.data.activeEmbed) || 0;

            const embed =
                session.data.embeds[index];

            if (!embed) {
                return showError(
                    interaction,
                    "No embed is currently selected."
                );
            }

            const value =
                interaction.fields.getTextInputValue(
                    "value"
                ).trim();

            embed[property] =
                value;

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        `${property} updated.`
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // AUTHOR
        // ====================================================

        if (id === "embed:modal:author") {

            const index =
                Number(session.data.activeEmbed) || 0;

            const embed =
                session.data.embeds[index];

            if (!embed) {
                return showError(
                    interaction,
                    "No embed is currently selected."
                );
            }

            embed.author = {
                name:
                    interaction.fields.getTextInputValue(
                        "name"
                    ).trim(),
                url:
                    interaction.fields.getTextInputValue(
                        "url"
                    ).trim(),
                iconURL:
                    interaction.fields.getTextInputValue(
                        "icon"
                    ).trim()
            };

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Author updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // FOOTER
        // ====================================================

        if (id === "embed:modal:footer") {

            const index =
                Number(session.data.activeEmbed) || 0;

            const embed =
                session.data.embeds[index];

            if (!embed) {
                return showError(
                    interaction,
                    "No embed is currently selected."
                );
            }

            embed.footer = {
                text:
                    interaction.fields.getTextInputValue(
                        "text"
                    ).trim(),
                iconURL:
                    interaction.fields.getTextInputValue(
                        "icon"
                    ).trim()
            };

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Footer updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // ADD / EDIT FIELD
        // ====================================================

        const fieldMatch =
            id.match(
                /^embed:modal:field:(add|edit)$/
            );

        if (fieldMatch) {

            const mode =
                fieldMatch[1];

            const name =
                interaction.fields.getTextInputValue(
                    "name"
                ).trim();

            const value =
                interaction.fields.getTextInputValue(
                    "value"
                ).trim();

            const inline =
                interaction.fields.getTextInputValue(
                    "inline"
                ).trim().toLowerCase() === "yes";

            if (!name || !value) {
                return showError(
                    interaction,
                    "Field name and value are required."
                );
            }

            if (mode === "add") {

                const created =
                    fields.addField(
                        session,
                        {
                            name,
                            value,
                            inline
                        }
                    );

                if (!created) {
                    return showError(
                        interaction,
                        "Unable to add the field. This embed may already contain 25 fields."
                    );
                }

            } else {

                const index =
                    Number(session.data.activeField) || 0;

                const updated =
                    fields.editField(
                        session,
                        index,
                        {
                            name,
                            value,
                            inline
                        }
                    );

                if (!updated) {
                    return showError(
                        interaction,
                        "Unable to edit that field."
                    );
                }
            }

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        mode === "add"
                            ? "Field added."
                            : "Field updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // MOVE FIELD
        // ====================================================

        if (id === "embed:modal:move:field") {

            const position =
                Number(
                    interaction.fields.getTextInputValue(
                        "position"
                    )
                );

            const current =
                Number(session.data.activeField) || 0;

            const target =
                position - 1;

            const moved =
                fields.moveField(
                    session,
                    current,
                    target
                );

            if (!moved) {
                return showError(
                    interaction,
                    "Invalid field position."
                );
            }

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Field moved."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // ADD / EDIT BUTTON
        // ====================================================

        const buttonMatch =
            id.match(
                /^embed:modal:button:(add|edit)$/
            );

        if (buttonMatch) {

            const mode =
                buttonMatch[1];

            const data = {
                label:
                    interaction.fields.getTextInputValue(
                        "label"
                    ).trim(),

                style:
                    interaction.fields.getTextInputValue(
                        "style"
                    ).trim().toLowerCase(),

                customId:
                    interaction.fields.getTextInputValue(
                        "customId"
                    ).trim(),

                emoji:
                    interaction.fields.getTextInputValue(
                        "emoji"
                    ).trim(),

                url:
                    interaction.fields.getTextInputValue(
                        "url"
                    ).trim()
            };

            const styles = [
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ];

            if (!styles.includes(data.style)) {
                return showError(
                    interaction,
                    "Invalid button style. Use primary, secondary, success, danger, or link."
                );
            }

            if (
                data.style === "link" &&
                !data.url
            ) {
                return showError(
                    interaction,
                    "Link buttons require a URL."
                );
            }

            if (mode === "add") {

                buttons.addButton(
                    session,
                    data
                );

            } else {

                const index =
                    Number(session.data.activeButton) || 0;

                if (
                    !buttons.editButton(
                        session,
                        index,
                        data
                    )
                ) {
                    return showError(
                        interaction,
                        "Unable to edit that button."
                    );
                }
            }

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        mode === "add"
                            ? "Button added."
                            : "Button updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // MOVE BUTTON
        // ====================================================

        if (id === "embed:modal:move:button") {

            const position =
                Number(
                    interaction.fields.getTextInputValue(
                        "position"
                    )
                );

            const current =
                Number(session.data.activeButton) || 0;

            const moved =
                buttons.moveButton(
                    session,
                    current,
                    position - 1
                );

            if (!moved) {
                return showError(
                    interaction,
                    "Invalid button position."
                );
            }

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Button moved."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // SELECT MENU
        // ====================================================

        if (id === "embed:modal:select-menu") {

            const index =
                Number(session.data.activeSelectMenu) || 0;

            const menu =
                session.data.selectMenus[index];

            if (!menu) {
                return showError(
                    interaction,
                    "No select menu is currently selected."
                );
            }

            const type =
                interaction.fields.getTextInputValue(
                    "type"
                ).trim().toLowerCase();

            const customId =
                interaction.fields.getTextInputValue(
                    "customId"
                ).trim();

            const placeholder =
                interaction.fields.getTextInputValue(
                    "placeholder"
                ).trim();

            const minValues =
                Number(
                    interaction.fields.getTextInputValue(
                        "min"
                    )
                );

            const maxValues =
                Number(
                    interaction.fields.getTextInputValue(
                        "max"
                    )
                );

            const validTypes = [
                "string",
                "user",
                "role",
                "mentionable",
                "channel"
            ];

            if (!validTypes.includes(type)) {
                return showError(
                    interaction,
                    "Invalid select menu type."
                );
            }

            if (
                !Number.isInteger(minValues) ||
                !Number.isInteger(maxValues) ||
                minValues < 0 ||
                maxValues < minValues
            ) {
                return showError(
                    interaction,
                    "Invalid minimum or maximum values."
                );
            }

            selectMenus.editSelectMenu(
                session,
                index,
                {
                    type,
                    customId,
                    placeholder,
                    minValues,
                    maxValues
                }
            );

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Select menu updated."
                    )
                ],
                flags: 64
            });
        }


        // ====================================================
        // MOVE EMBED
        // ====================================================

        if (id === "embed:modal:move:embed") {

            const position =
                Number(
                    interaction.fields.getTextInputValue(
                        "position"
                    )
                );

            const from =
                Number(session.data.activeEmbed) || 0;

            const to =
                position - 1;

            if (
                !Array.isArray(
                    session.data.embeds
                ) ||
                from < 0 ||
                from >= session.data.embeds.length ||
                to < 0 ||
                to >= session.data.embeds.length
            ) {
                return showError(
                    interaction,
                    "Invalid embed position."
                );
            }

            if (from !== to) {

                const [embed] =
                    session.data.embeds.splice(
                        from,
                        1
                    );

                session.data.embeds.splice(
                    to,
                    0,
                    embed
                );

                session.data.activeEmbed =
                    to;
            }

            builder.updateSession(session);

            return interaction.reply({
                embeds: [
                    globalEmbeds.success(
                        interaction.user,
                        "Embed moved."
                    )
                ],
                flags: 64
            });
        }


        return;
    },

    // ========================================================
    // MODAL FACTORIES
    // ========================================================

    contentModal,
    embedPropertyModal,
    authorModal,
    footerModal,
    fieldModal,
    buttonModal,
    selectMenuModal,
    moveModal
};
