const {
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder
} = require("discord.js");

// =========================
// SELECT TYPES
// =========================

const types = {
    string: StringSelectMenuBuilder,
    user: UserSelectMenuBuilder,
    role: RoleSelectMenuBuilder,
    channel: ChannelSelectMenuBuilder,
    mentionable: MentionableSelectMenuBuilder
};

// =========================
// CREATE SELECT
// =========================

function create(data = {}) {
    const type =
        String(data.type || "string")
            .toLowerCase();

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

    if (data.disabled === true) {
        select.setDisabled(true);
    }

    if (
        Number.isInteger(data.minValues)
    ) {
        select.setMinValues(
            data.minValues
        );
    }

    if (
        Number.isInteger(data.maxValues)
    ) {
        select.setMaxValues(
            data.maxValues
        );
    }

    if (
        type === "string" &&
        Array.isArray(data.options)
    ) {
        if (data.options.length) {
            select.addOptions(
                data.options.map(
                    option => {
                        const item = {
                            label: String(
                                option.label || ""
                            ),
                            value: String(
                                option.value || ""
                            )
                        };

                        if (
                            option.description
                        ) {
                            item.description =
                                String(
                                    option.description
                                );
                        }

                        if (
                            option.emoji
                        ) {
                            item.emoji =
                                String(
                                    option.emoji
                                );
                        }

                        if (
                            option.default === true
                        ) {
                            item.default = true;
                        }

                        return item;
                    }
                )
            );
        }
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
    options = [],
    minValues = 1,
    maxValues = 1,
    disabled = false
} = {}) {
    return {
        type,
        customId,
        placeholder,
        options,
        minValues,
        maxValues,
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
// IS STRING SELECT
// =========================

function isString(type) {
    return (
        String(type || "")
            .toLowerCase() === "string"
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
