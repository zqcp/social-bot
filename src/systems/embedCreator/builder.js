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
// LIMITS
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
    actionRows: 5,
    buttonsPerRow: 5,
    selectOptions: 25
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
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function validColor(value) {
    if (!hasValue(value)) {
        return true;
    }

    const color = String(value).trim();

    if (/^#[0-9a-fA-F]{6}$/.test(color)) {
        return true;
    }

    if (/^0x[0-9a-fA-F]{6}$/.test(color)) {
        return true;
    }

    if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return true;
    }

    return false;
}

function normalizeColor(value) {
    if (!hasValue(value)) {
        return null;
    }

    const color = String(value).trim();

    if (color.startsWith("#")) {
        return color;
    }

    if (color.startsWith("0x")) {
        return `#${color.slice(2)}`;
    }

    return `#${color}`;
}

// =========================
// VALIDATE EMBED
// =========================

function validateEmbed(data = {}) {
    const embed = data.embed || {};
    const errors = [];

    const title = clean(embed.title);
    const description = clean(embed.description);

    const author = embed.author || {};
    const footer = embed.footer || {};

    if (title.length > LIMITS.title) {
        errors.push(
            `Title cannot exceed ${LIMITS.title} characters.`
        );
    }

    if (description.length > LIMITS.description) {
        errors.push(
            `Description cannot exceed ${LIMITS.description} characters.`
        );
    }

    if (
        clean(author.name).length >
        LIMITS.authorName
    ) {
        errors.push(
            `Author name cannot exceed ${LIMITS.authorName} characters.`
        );
    }

    if (
        clean(footer.text).length >
        LIMITS.footerText
    ) {
        errors.push(
            `Footer text cannot exceed ${LIMITS.footerText} characters.`
        );
    }

    if (
        !validUrl(embed.url)
    ) {
        errors.push(
            "The embed URL is invalid."
        );
    }

    if (
        !validUrl(author.url)
    ) {
        errors.push(
            "The author URL is invalid."
        );
    }

    if (
        !validUrl(author.iconURL)
    ) {
        errors.push(
            "The author icon URL is invalid."
        );
    }

    if (
        !validUrl(footer.iconURL)
    ) {
        errors.push(
            "The footer icon URL is invalid."
        );
    }

    if (
        !validUrl(embed.thumbnail)
    ) {
        errors.push(
            "The thumbnail URL is invalid."
        );
    }

    if (
        !validUrl(embed.image)
    ) {
        errors.push(
            "The image URL is invalid."
        );
    }

    if (
        !validColor(embed.color)
    ) {
        errors.push(
            "The embed color is invalid."
        );
    }

    const fields =
        Array.isArray(embed.fields)
            ? embed.fields
            : [];

    if (fields.length > LIMITS.fields) {
        errors.push(
            `An embed cannot contain more than ${LIMITS.fields} fields.`
        );
    }

    let totalCharacters =
        title.length +
        description.length +
        clean(author.name).length +
        clean(footer.text).length;

    for (
        let index = 0;
        index < fields.length;
        index++
    ) {
        const field = fields[index] || {};
        const name = clean(field.name);
        const value = clean(field.value);

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

        totalCharacters +=
            name.length +
            value.length;
    }

    if (
        totalCharacters >
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
    interaction = null
) {
    const prepared =
        variables.replaceObject(
            data,
            interaction
        );

    const validation =
        validateEmbed(prepared);

    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors,
            embed: null
        };
    }

    const dataEmbed =
        prepared.embed || {};

    const embed =
        new EmbedBuilder();

    if (
        hasValue(dataEmbed.title)
    ) {
        embed.setTitle(
            clean(dataEmbed.title)
        );
    }

    if (
        hasValue(dataEmbed.description)
    ) {
        embed.setDescription(
            clean(dataEmbed.description)
        );
    }

    if (
        hasValue(dataEmbed.color)
    ) {
        embed.setColor(
            normalizeColor(
                dataEmbed.color
            )
        );
    }

    if (
        hasValue(dataEmbed.url)
    ) {
        embed.setURL(
            clean(dataEmbed.url)
        );
    }

    if (
        hasValue(dataEmbed.author?.name)
    ) {
        const author = {
            name: clean(
                dataEmbed.author.name
            )
        };

        if (
            hasValue(
                dataEmbed.author.iconURL
            )
        ) {
            author.iconURL =
                clean(
                    dataEmbed.author.iconURL
                );
        }

        if (
            hasValue(
                dataEmbed.author.url
            )
        ) {
            author.url =
                clean(
                    dataEmbed.author.url
                );
        }

        embed.setAuthor(author);
    }

    if (
        hasValue(dataEmbed.footer?.text)
    ) {
        const footer = {
            text: clean(
                dataEmbed.footer.text
            )
        };

        if (
            hasValue(
                dataEmbed.footer.iconURL
            )
        ) {
            footer.iconURL =
                clean(
                    dataEmbed.footer.iconURL
                );
        }

        embed.setFooter(footer);
    }

    if (
        hasValue(dataEmbed.thumbnail)
    ) {
        embed.setThumbnail(
            clean(dataEmbed.thumbnail)
        );
    }

    if (
        hasValue(dataEmbed.image)
    ) {
        embed.setImage(
            clean(dataEmbed.image)
        );
    }

    if (
        Array.isArray(dataEmbed.fields) &&
        dataEmbed.fields.length
    ) {
        embed.addFields(
            dataEmbed.fields.map(
                field => ({
                    name: clean(field.name),
                    value: clean(field.value),
                    inline:
                        field.inline === true
                })
            )
        );
    }

    return {
        success: true,
        errors: [],
        embed
    };
}

// =========================
// BUTTON STYLE
// =========================

function getButtonStyle(style) {
    const value =
        String(style || "")
            .toLowerCase();

    const styles = {
        primary: ButtonStyle.Primary,
        secondary: ButtonStyle.Secondary,
        success: ButtonStyle.Success,
        danger: ButtonStyle.Danger,
        link: ButtonStyle.Link
    };

    return styles[value] || null;
}

// =========================
// BUILD BUTTON
// =========================

function buildButton(component = {}) {
    const button =
        new ButtonBuilder();

    const style =
        getButtonStyle(
            component.style
        );

    if (!style) {
        throw new Error(
            "Invalid button style."
        );
    }

    button.setStyle(style);

    if (
        hasValue(component.label)
    ) {
        button.setLabel(
            clean(component.label)
        );
    }

    if (
        hasValue(component.emoji)
    ) {
        button.setEmoji(
            clean(component.emoji)
        );
    }

    if (
        component.disabled === true
    ) {
        button.setDisabled(true);
    }

    if (
        style === ButtonStyle.Link
    ) {
        if (!validUrl(component.url)) {
            throw new Error(
                "Invalid button URL."
            );
        }

        if (!hasValue(component.url)) {
            throw new Error(
                "Link buttons require a URL."
            );
        }

        button.setURL(
            clean(component.url)
        );
    } else {
        const customId =
            clean(component.customId);

        if (!customId) {
            throw new Error(
                "Non-link buttons require a custom ID."
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

        button.setCustomId(
            customId
        );
    }

    return button;
}

// =========================
// BUILD SELECT
// =========================

function buildSelect(component = {}) {
    const type =
        String(component.type || "string")
            .toLowerCase();

    let select;

    if (type === "string") {
        select =
            new StringSelectMenuBuilder();

        if (
            Array.isArray(component.options)
        ) {
            if (
                component.options.length >
                LIMITS.selectOptions
            ) {
                throw new Error(
                    `A select menu cannot contain more than ${LIMITS.selectOptions} options.`
                );
            }

            select.addOptions(
                component.options.map(
                    option => ({
                        label: clean(
                            option.label
                        ),
                        value: clean(
                            option.value
                        ),
                        description:
                            hasValue(
                                option.description
                            )
                                ? clean(
                                    option.description
                                )
                                : undefined,
                        emoji:
                            hasValue(
                                option.emoji
                            )
                                ? clean(
                                    option.emoji
                                )
                                : undefined,
                        default:
                            option.default === true
                    })
                )
            );
        }
    } else if (type === "user") {
        select =
            new UserSelectMenuBuilder();
    } else if (type === "role") {
        select =
            new RoleSelectMenuBuilder();
    } else if (type === "channel") {
        select =
            new ChannelSelectMenuBuilder();
    } else if (type === "mentionable") {
        select =
            new MentionableSelectMenuBuilder();
    } else {
        throw new Error(
            "Invalid select menu type."
        );
    }

    const customId =
        clean(component.customId);

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

    select.setCustomId(customId);

    if (
        hasValue(component.placeholder)
    ) {
        select.setPlaceholder(
            clean(component.placeholder)
        );
    }

    if (
        component.disabled === true
    ) {
        select.setDisabled(true);
    }

    if (
        Number.isInteger(component.minValues)
    ) {
        select.setMinValues(
            component.minValues
        );
    }

    if (
        Number.isInteger(component.maxValues)
    ) {
        select.setMaxValues(
            component.maxValues
        );
    }

    return select;
}

// =========================
// BUILD COMPONENT ROWS
// =========================

function buildComponents(
    components = []
) {
    if (!Array.isArray(components)) {
        return {
            success: true,
            errors: [],
            rows: []
        };
    }

    const rows = [];
    let currentButtonRow = null;

    function pushButtonRow() {
        if (
            currentButtonRow &&
            currentButtonRow.components.length
        ) {
            rows.push(
                currentButtonRow
            );
        }

        currentButtonRow = null;
    }

    for (
        const component of components
    ) {
        if (!component) {
            continue;
        }

        const type =
            String(
                component.type || "button"
            ).toLowerCase();

        if (type === "button") {
            if (
                !currentButtonRow ||
                currentButtonRow.components.length >=
                    LIMITS.buttonsPerRow
            ) {
                pushButtonRow();

                currentButtonRow =
                    new ActionRowBuilder();
            }

            currentButtonRow.addComponents(
                buildButton(component)
            );

            continue;
        }

        pushButtonRow();

        rows.push(
            new ActionRowBuilder()
                .addComponents(
                    buildSelect(component)
                )
        );
    }

    pushButtonRow();

    if (
        rows.length >
        LIMITS.actionRows
    ) {
        throw new Error(
            `A message cannot contain more than ${LIMITS.actionRows} component rows.`
        );
    }

    return {
        success: true,
        errors: [],
        rows
    };
}

// =========================
// BUILD MESSAGE
// =========================

function buildMessage(
    data = {},
    interaction = null
) {
    const result =
        buildEmbed(
            data,
            interaction
        );

    if (!result.success) {
        return {
            success: false,
            errors: result.errors,
            payload: null
        };
    }

    let components;

    try {
        components =
            buildComponents(
                variables.replaceObject(
                    data.components || [],
                    interaction
                )
            );
    } catch (error) {
        return {
            success: false,
            errors: [
                error.message
            ],
            payload: null
        };
    }

    const payload = {
        embeds: [
            result.embed
        ]
    };

    if (
        hasValue(data.content)
    ) {
        payload.content =
            variables.replace(
                data.content,
                interaction
            );
    }

    if (
        components.rows.length
    ) {
        payload.components =
            components.rows;
    }

    return {
        success: true,
        errors: [],
        payload
    };
}

// =========================
// EXPORTS
// =========================

module.exports = {
    LIMITS,
    validateEmbed,
    buildEmbed,
    buildButton,
    buildSelect,
    buildComponents,
    buildMessage
};
