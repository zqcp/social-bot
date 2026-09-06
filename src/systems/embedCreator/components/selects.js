const {
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder
} = require("discord.js");

// =========================
// SELECT TYPES
// =========================

const types = {
    string: StringSelectMenuBuilder,
    user: UserSelectMenuBuilder,
    role: StringSelectMenuBuilder,
    channel: ChannelSelectMenuBuilder,
    mentionable: MentionableSelectMenuBuilder
};

// =========================
// CREATE SELECT
// =========================

function create(data = {}) {

    const type = String(
        data.type ||
        data.selectType ||
        "string"
    ).toLowerCase();

    const SelectBuilder =
        types[type];

    if (!SelectBuilder) {
        throw new Error(
            "Invalid select menu type."
        );
    }

    const select =
        new SelectBuilder();

    if (!data.customId) {
        throw new Error(
            "Select menus require a custom ID."
        );
    }

    select.setCustomId(
        String(data.customId)
    );

    if (data.placeholder) {
        select.setPlaceholder(
            String(data.placeholder)
        );
    }

    if (
        Number.isInteger(
            data.minValues
        )
    ) {
        select.setMinValues(
            data.minValues
        );
    }

    if (
        Number.isInteger(
            data.maxValues
        )
    ) {
        select.setMaxValues(
            data.maxValues
        );
    }

    if (data.disabled === true) {
        select.setDisabled(true);
    }

    // =========================
    // SELECT OPTIONS
    // =========================

    if (
        (
            type === "string" ||
            type === "role"
        ) &&
        Array.isArray(data.options) &&
        data.options.length
    ) {
        select.addOptions(
            data.options
        );
    }

    return select;
}

// =========================
// CREATE DATA
// =========================

function createData({
    type = "string",
    customId = "",
    placeholder = "",
    minValues = 1,
    maxValues = 1,
    options = [],
    disabled = false
} = {}) {

    return {
        type: "select",
        selectType: type,
        customId,
        placeholder,
        minValues,
        maxValues,
        options,
        disabled
    };
}

// =========================
// GET TYPES
// =========================

function getTypes() {
    return {
        ...types
    };
}

// =========================
// STRING SELECT CHECK
// =========================

function isString(data = {}) {

    return (
        String(
            data.selectType ||
            data.type ||
            ""
        ).toLowerCase() ===
        "string"
    );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    create,
    createData,
    getTypes,
    isString,
    types
};
