const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder
} = require("discord.js");

const variables = require("./variables");

// =========================
// DISCORD LIMITS
// =========================

const LIMITS = {
    title: 256,
    description: 4096,
    authorName: 256,
    footerText: 2048,
    fieldName: 256,
    fieldValue: 1024,
    fields: 25,
    totalEmbed: 6000,

    buttonLabel: 80,
    customId: 100,
    buttonsPerRow: 5,
    actionRows: 5,

    selectPlaceholder: 150,
    selectOptions: 25,
    selectOptionLabel: 100,
    selectOptionValue: 100,
    selectOptionDescription: 100
};

// =========================
// HELPERS
// =========================

function clean(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}

function hasValue(value) {
    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
}

function validUrl(value) {
    if (!hasValue(value)) {
        return true;
    }

    try {
        const url = new URL(
            String(value).trim()
        );

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}

function validColor(value) {
    if (!hasValue(value)) {
        return true;
    }

    const color = clean(value)
        .replace(/^#/, "");

    return /^[0-9a-fA-F]{6}$/.test(
        color
    );
}

function normalizeColor(value) {
    if (!hasValue(value)) {
        return null;
    }

    return parseInt(
        clean(value).replace(/^#/, ""),
        16
    );
}

// =========================
// EMBED VALIDATION
// =========================

function validateEmbed(data = {}) {
    const embed = data.embed || {};
    const author = embed.author || {};
    const footer = embed.footer || {};
    const fields = Array.isArray(
        embed.fields
    )
        ? embed.fields
        : [];

    const errors = [];

    const title = clean(embed.title);
    const description =
        clean(embed.description);

    const authorName =
        clean(author.name);

    const footerText =
        clean(footer.text);

    // -------------------------
    // Basic lengths
    // -------------------------

    if (
        title.length >
        LIMITS.title
    ) {
        errors.push(
            `Embed title cannot exceed ${LIMITS.title} characters.`
        );
    }

    if (
        description.length >
        LIMITS.description
    ) {
        errors.push(
            `Embed description cannot exceed ${LIMITS.description} characters.`
        );
    }

    if (
        authorName.length >
        LIMITS.authorName
    ) {
        errors.push(
            `Author name cannot exceed ${LIMITS.authorName} characters.`
        );
    }

    if (
        footerText.length >
        LIMITS.footerText
    ) {
        errors.push(
            `Footer text cannot exceed ${LIMITS.footerText} characters.`
        );
    }

    // -------------------------
    // URLs
    // -------------------------

    if (!validUrl(embed.url)) {
        errors.push(
            "Embed URL must be a valid HTTP or HTTPS URL."
        );
    }

    if (!validUrl(author.iconURL)) {
        errors.push(
            "Author icon URL must be a valid HTTP or HTTPS URL."
        );
    }

    if (!validUrl(author.url)) {
        errors.push(
            "Author URL must be a valid HTTP or HTTPS URL."
        );
    }

    if (!validUrl(footer.iconURL)) {
        errors.push(
            "Footer icon URL must be a valid HTTP or HTTPS URL."
        );
    }

    if (!validUrl(embed.thumbnail)) {
        errors.push(
            "Thumbnail URL must be a valid HTTP or HTTPS URL."
        );
    }

    if (!validUrl(embed.image)) {
        errors.push(
            "Image URL must be a valid HTTP or HTTPS URL."
        );
    }

    // -------------------------
    // Color
    // -------------------------

    if (!validColor(embed.color)) {
        errors.push(
            "Embed color must be a valid 6-digit hexadecimal color."
        );
    }

    // -------------------------
    // Fields
    // -------------------------

    if (
        fields.length >
        LIMITS.fields
    ) {
        errors.push(
            `An embed cannot contain more than ${LIMITS.fields} fields.`
        );
    }

    fields.forEach(
        (field, index) => {
            const name =
                clean(field?.name);

            const value =
                clean(field?.value);

            if (!name) {
                errors.push(
                    `Field ${index + 1} must have a name.`
                );
            }

            if (!value) {
                errors.push(
                    `Field ${index + 1} must have a value.`
                );
            }

            if (
                name.length >
                LIMITS.fieldName
            ) {
                errors.push(
                    `Field ${index + 1} name cannot exceed ${LIMITS.fieldName} characters.`
                );
            }

            if (
                value.length >
                LIMITS.fieldValue
            ) {
                errors.push(
                    `Field ${index + 1} value cannot exceed ${LIMITS.fieldValue} characters.`
                );
            }
        }
    );

    // -------------------------
    // Total embed characters
    // -------------------------

    let total = 0;

    total += title.length;
    total += description.length;
    total += authorName.length;
    total += footerText.length;

    for (const field of fields) {
        total += clean(field?.name).length;
        total += clean(field?.value).length;
    }

    if (
        total >
        LIMITS.totalEmbed
    ) {
        errors.push(
            `The embed cannot exceed ${LIMITS.totalEmbed} total characters.`
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// =========================
// BUILD EMBED
// =========================

function buildEmbed(
    data = {},
    interaction
) {
    const prepared =
        variables.replaceObject(
            data.embed || {},
            interaction
        );

    const validation =
        validateEmbed({
            embed: prepared
        });

    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors
        };
    }

    const embed =
        new EmbedBuilder();

    const title =
        clean(prepared.title);

    const description =
        clean(prepared.description);

    const color =
        normalizeColor(
            prepared.color
        );

    const url =
        clean(prepared.url);

    const author =
        prepared.author || {};

    const footer =
        prepared.footer || {};

    const fields =
        Array.isArray(
            prepared.fields
        )
            ? prepared.fields
            : [];

    if (title) {
        embed.setTitle(title);
    }

    if (description) {
        embed.setDescription(
            description
        );
    }

    if (color !== null) {
        embed.setColor(color);
    }

    if (url) {
        embed.setURL(url);
    }

    if (clean(author.name)) {
        const authorData = {
            name: clean(
                author.name
            )
        };

        if (
            clean(author.iconURL)
        ) {
            authorData.iconURL =
                clean(author.iconURL);
        }

        if (
            clean(author.url)
        ) {
            authorData.url =
                clean(author.url);
        }

        embed.setAuthor(
            authorData
        );
    }

    if (clean(footer.text)) {
        const footerData = {
            text: clean(
                footer.text
            )
        };

        if (
            clean(footer.iconURL)
        ) {
            footerData.iconURL =
                clean(
                    footer.iconURL
                );
        }

        embed.setFooter(
            footerData
        );
    }

    if (
        clean(prepared.thumbnail)
    ) {
        embed.setThumbnail(
            clean(
                prepared.thumbnail
            )
        );
    }

    if (
        clean(prepared.image)
    ) {
        embed.setImage(
            clean(
                prepared.image
            )
        );
    }

    if (fields.length) {
        embed.addFields(
            fields.map(field => ({
                name: clean(
                    field.name
                ),
                value: clean(
                    field.value
                ),
                inline:
                    field.inline === true
            }))
        );
    }

    return {
        success: true,
        embed
    };
}

// =========================
// BUTTON STYLE
// =========================

function getButtonStyle(
    style
) {
    const styles = {
        primary:
            ButtonStyle.Primary,

        secondary:
            ButtonStyle.Secondary,

        success:
            ButtonStyle.Success,

        danger:
            ButtonStyle.Danger,

        link:
            ButtonStyle.Link
    };

    return styles[
        clean(style).toLowerCase()
    ];
}

// =========================
// BUILD BUTTON
// =========================

function buildButton(
    data = {}
) {
    const style =
        getButtonStyle(
            data.style
        );

    if (!style) {
        throw new Error(
            "Invalid button style."
        );
    }

    const label =
        clean(data.label);

    const customId =
        clean(data.customId);

    const url =
        clean(data.url);

    const emoji =
        clean(data.emoji);

    if (
        label.length >
        LIMITS.buttonLabel
    ) {
        throw new Error(
            `Button label cannot exceed ${LIMITS.buttonLabel} characters.`
        );
    }

    if (
        customId.length >
        LIMITS.customId
    ) {
        throw new Error(
            `Button custom ID cannot exceed ${LIMITS.customId} characters.`
        );
    }

    if (
        style === ButtonStyle.Link
    ) {
        if (!url) {
            throw new Error(
                "Link buttons require a URL."
            );
        }

        if (!validUrl(url)) {
            throw new Error(
                "Link button URL must be a valid HTTP or HTTPS URL."
            );
        }
    } else if (!customId) {
        throw new Error(
            "Non-link buttons require a custom ID."
        );
    }

    const button =
        new ButtonBuilder()
            .setStyle(style);

    if (label) {
        button.setLabel(label);
    }

    if (emoji) {
        button.setEmoji(emoji);
    }

    if (
        data.disabled === true
    ) {
        button.setDisabled(true);
    }

    if (
        style === ButtonStyle.Link
    ) {
        button.setURL(url);
    } else {
        button.setCustomId(
            customId
        );
    }

    return button;
}

// =========================
// SELECT BUILDERS
// =========================

const selectBuilders = {
    string:
        StringSelectMenuBuilder,

    user:
        UserSelectMenuBuilder,

    role:
        RoleSelectMenuBuilder,

    channel:
        ChannelSelectMenuBuilder,

    mentionable:
        MentionableSelectMenuBuilder
};

// =========================
// BUILD SELECT
// =========================

function buildSelect(
    data = {}
) {
    const type =
        clean(data.type || "string")
            .toLowerCase();

    const SelectBuilder =
        selectBuilders[type];

    if (!SelectBuilder) {
        throw new Error(
            "Invalid select menu type."
        );
    }

    const customId =
        clean(data.customId);

    if (!customId) {
        throw new Error(
            "Select menus require a custom ID."
        );
    }

    if (
        customId.length >
        LIMITS.customId
    ) {
        throw new Error(
            `Select menu custom ID cannot exceed ${LIMITS.customId} characters.`
        );
    }

    const placeholder =
        clean(data.placeholder);

    if (
        placeholder.length >
        LIMITS.selectPlaceholder
    ) {
        throw new Error(
            `Select menu placeholder cannot exceed ${LIMITS.selectPlaceholder} characters.`
        );
    }

    const minValues =
        Number.isInteger(
            data.minValues
        )
            ? data.minValues
            : 1;

    const maxValues =
        Number.isInteger(
            data.maxValues
        )
            ? data.maxValues
            : 1;

    if (
        minValues < 0 ||
        minValues > 25
    ) {
        throw new Error(
            "Select menu minimum values must be between 0 and 25."
        );
    }

    if (
        maxValues < 1 ||
        maxValues > 25
    ) {
        throw new Error(
            "Select menu maximum values must be between 1 and 25."
        );
    }

    if (
        minValues > maxValues
    ) {
        throw new Error(
            "Select menu minimum values cannot exceed maximum values."
        );
    }

    const select =
        new SelectBuilder()
            .setCustomId(customId)
            .setMinValues(
                minValues
            )
            .setMaxValues(
                maxValues
            );

    if (placeholder) {
        select.setPlaceholder(
            placeholder
        );
    }

    if (
        data.disabled === true
    ) {
        select.setDisabled(true);
    }

    if (type === "string") {
        const options =
            Array.isArray(
                data.options
            )
                ? data.options
                : [];

        if (
            options.length >
            LIMITS.selectOptions
        ) {
            throw new Error(
                `A select menu cannot contain more than ${LIMITS.selectOptions} options.`
            );
        }

        if (
            !options.length
        ) {
            throw new Error(
                "String select menus require at least one option."
            );
        }

        select.addOptions(
            options.map(
                (option, index) => {
                    const label =
                        clean(
                            option?.label
                        );

                    const value =
                        clean(
                            option?.value
                        );

                    const description =
                        clean(
                            option?.description
                        );

                    if (!label) {
                        throw new Error(
                            `Select option ${index + 1} requires a label.`
                        );
                    }

                    if (!value) {
                        throw new Error(
                            `Select option ${index + 1} requires a value.`
                        );
                    }

                    if (
                        label.length >
                        LIMITS.selectOptionLabel
                    ) {
                        throw new Error(
                            `Select option ${index + 1} label cannot exceed ${LIMITS.selectOptionLabel} characters.`
                        );
                    }

                    if (
                        value.length >
                        LIMITS.selectOptionValue
                    ) {
                        throw new Error(
                            `Select option ${index + 1} value cannot exceed ${LIMITS.selectOptionValue} characters.`
                        );
                    }

                    if (
                        description.length >
                        LIMITS.selectOptionDescription
                    ) {
                        throw new Error(
                            `Select option ${index + 1} description cannot exceed ${LIMITS.selectOptionDescription} characters.`
                        );
                    }

                    const item = {
                        label,
                        value
                    };

                    if (description) {
                        item.description =
                            description;
                    }

                    if (
                        option?.emoji
                    ) {
                        item.emoji =
                            String(
                                option.emoji
                            );
                    }

                    if (
                        option?.default === true
                    ) {
                        item.default =
                            true;
                    }

                    return item;
                }
            )
        );
    }

    return select;
}

// =========================
// BUILD COMPONENTS
// =========================

function buildComponents(
    components = []
) {
    if (
        !Array.isArray(components)
    ) {
        return {
            success: true,
            rows: []
        };
    }

    if (
        components.length === 0
    ) {
        return {
            success: true,
            rows: []
        };
    }

    const rows = [];
    let currentButtonRow = null;

    function addRow(row) {
        if (
            rows.length >=
            LIMITS.actionRows
        ) {
            throw new Error(
                `A message cannot contain more than ${LIMITS.actionRows} action rows.`
            );
        }

        rows.push(row);
    }

    for (
        const component of components
    ) {
        if (
            component?.type === "button"
        ) {
            if (
                !currentButtonRow ||
                currentButtonRow.components
                    .length >=
                    LIMITS.buttonsPerRow
            ) {
                currentButtonRow =
                    new ActionRowBuilder();

                addRow(
                    currentButtonRow
                );
            }

            currentButtonRow.addComponents(
                buildButton(
                    component
                )
            );

            continue;
        }

        if (
            currentButtonRow
        ) {
            currentButtonRow = null;
        }

        const select =
            buildSelect(
                component
            );

        addRow(
            new ActionRowBuilder()
                .addComponents(
                    select
                )
        );
    }

    return {
        success: true,
        rows
    };
}

// =========================
// BUILD MESSAGE
// =========================

function buildMessage(
    data = {},
    interaction
) {
    const embedResult =
        buildEmbed(
            data,
            interaction
        );

    if (
        !embedResult.success
    ) {
        return embedResult;
    }

    let componentResult;

    try {
        componentResult =
            buildComponents(
                data.components
            );
    } catch (error) {
        return {
            success: false,
            errors: [
                error.message
            ]
        };
    }

    const payload = {};

    const content =
        variables.replace(
            data.content || "",
            interaction
        );

    if (content) {
        payload.content =
            content;
    }

    const hasEmbed =
        embedResult.embed
            .data &&
        Object.keys(
            embedResult.embed.data
        ).length > 0;

    if (hasEmbed) {
        payload.embeds = [
            embedResult.embed
        ];
    }

    if (
        componentResult.rows.length
    ) {
        payload.components =
            componentResult.rows;
    }

    return {
        success: true,
        embed:
            embedResult.embed,
        payload
    };
}

// =========================
// EXPORTS
// =========================

module.exports = {
    LIMITS,

    clean,
    hasValue,
    validUrl,
    validColor,
    normalizeColor,

    validateEmbed,
    buildEmbed,

    getButtonStyle,
    buildButton,
    buildSelect,
    buildComponents,

    buildMessage
};
