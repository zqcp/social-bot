const {
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");

const SELECT_TYPES = {
    string: StringSelectMenuBuilder,
    user: UserSelectMenuBuilder,
    role: RoleSelectMenuBuilder,
    mentionable: MentionableSelectMenuBuilder,
    channel: ChannelSelectMenuBuilder
};

const SELECT_ACTIONS = {
    none: "none",
    addRole: "add_role",
    removeRole: "remove_role"
};

function clamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(min, Math.min(max, number));
}

function createSelectMenu(data = {}) {
    const type = String(data.type || "string").toLowerCase();

    if (!SELECT_TYPES[type]) {
        return null;
    }

    const customId =
        data.customId ||
        `embed_select_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 8)}`;

    const Menu = SELECT_TYPES[type];

    const menu = new Menu()
        .setCustomId(customId)
        .setPlaceholder(data.placeholder || "Select an option")
        .setMinValues(clamp(data.minValues ?? 1, 0, 25))
        .setMaxValues(clamp(data.maxValues ?? 1, 1, 25))
        .setDisabled(Boolean(data.disabled));

    if (type === "string") {
        const options = Array.isArray(data.options)
            ? data.options.slice(0, 25)
            : [];

        if (options.length) {
            menu.addOptions(
                options.map(option => ({
                    label: String(option.label || "Option").slice(0, 100),
                    value: String(
                        option.value ||
                        `option_${Date.now()}`
                    ).slice(0, 100),
                    ...(option.description
                        ? {
                            description: String(
                                option.description
                            ).slice(0, 100)
                        }
                        : {}),
                    ...(option.emoji
                        ? { emoji: option.emoji }
                        : {}),
                    ...(option.default !== undefined
                        ? {
                            default: Boolean(option.default)
                        }
                        : {})
                }))
            );
        }
    }

    if (type === "channel" && Array.isArray(data.channelTypes)) {
        const validTypes = data.channelTypes.filter(type =>
            Object.values(ChannelType).includes(type)
        );

        if (validTypes.length) {
            menu.setChannelTypes(validTypes);
        }
    }

    return menu;
}

function createSelectMenus(selectMenus = []) {
    return selectMenus
        .map(createSelectMenu)
        .filter(Boolean);
}

function addSelectMenu(session, data = {}) {
    if (!Array.isArray(session.data.selectMenus)) {
        session.data.selectMenus = [];
    }

    const type = String(data.type || "string").toLowerCase();

    if (!SELECT_TYPES[type]) {
        return null;
    }

    const minValues = clamp(data.minValues ?? 1, 0, 25);
    const maxValues = Math.max(
        minValues,
        clamp(data.maxValues ?? 1, 1, 25)
    );

    const menu = {
        type,

        customId:
            data.customId ||
            `embed_select_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        placeholder: data.placeholder || "Select an option",

        minValues,
        maxValues,

        disabled: Boolean(data.disabled),

        options: type === "string"
            ? (Array.isArray(data.options)
                ? data.options.slice(0, 25)
                : [])
            : [],

        channelTypes: type === "channel"
            ? (Array.isArray(data.channelTypes)
                ? data.channelTypes
                : [])
            : [],

        action: data.action || SELECT_ACTIONS.none,
        roleId: data.roleId || null
    };

    if (!SELECT_ACTIONS[menu.action]) {
        menu.action = SELECT_ACTIONS.none;
    }

    if (
        menu.action !== SELECT_ACTIONS.none &&
        !menu.roleId
    ) {
        return null;
    }

    session.data.selectMenus.push(menu);
    session.data.activeSelectMenu =
        session.data.selectMenus.length - 1;

    session.updatedAt = Date.now();

    return menu;
}

function editSelectMenu(session, index, changes = {}) {
    if (!session?.data?.selectMenus?.[index]) {
        return false;
    }

    const menu = session.data.selectMenus[index];

    if (changes.type !== undefined) {
        const type = String(changes.type).toLowerCase();

        if (!SELECT_TYPES[type]) {
            return false;
        }

        menu.type = type;

        if (type !== "string") {
            menu.options = [];
        }

        if (type !== "channel") {
            menu.channelTypes = [];
        }
    }

    if (changes.customId !== undefined) {
        menu.customId = changes.customId;
    }

    if (changes.placeholder !== undefined) {
        menu.placeholder = changes.placeholder;
    }

    if (changes.minValues !== undefined) {
        menu.minValues = clamp(changes.minValues, 0, 25);
    }

    if (changes.maxValues !== undefined) {
        menu.maxValues = clamp(changes.maxValues, 1, 25);
    }

    if (menu.maxValues < menu.minValues) {
        menu.maxValues = menu.minValues;
    }

    if (changes.disabled !== undefined) {
        menu.disabled = Boolean(changes.disabled);
    }

    if (changes.options !== undefined) {
        if (menu.type !== "string") {
            return false;
        }

        if (!Array.isArray(changes.options)) {
            return false;
        }

        menu.options = changes.options.slice(0, 25);
    }

    if (changes.channelTypes !== undefined) {
        if (menu.type !== "channel") {
            return false;
        }

        menu.channelTypes = Array.isArray(changes.channelTypes)
            ? changes.channelTypes.filter(type =>
                Object.values(ChannelType).includes(type)
            )
            : [];
    }

    if (changes.action !== undefined) {
        if (!SELECT_ACTIONS[changes.action]) {
            return false;
        }

        menu.action = changes.action;
    }

    if (changes.roleId !== undefined) {
        menu.roleId = changes.roleId;
    }

    if (
        menu.action !== SELECT_ACTIONS.none &&
        !menu.roleId
    ) {
        return false;
    }

    session.updatedAt = Date.now();

    return true;
}

function addOption(session, menuIndex, option) {
    const menu = session?.data?.selectMenus?.[menuIndex];

    if (!menu || menu.type !== "string") {
        return false;
    }

    if (!Array.isArray(menu.options)) {
        menu.options = [];
    }

    if (menu.options.length >= 25) {
        return false;
    }

    if (!option?.label || !option?.value) {
        return false;
    }

    menu.options.push({
        label: String(option.label).slice(0, 100),
        value: String(option.value).slice(0, 100),
        ...(option.description
            ? {
                description: String(
                    option.description
                ).slice(0, 100)
            }
            : {}),
        ...(option.emoji
            ? { emoji: option.emoji }
            : {}),
        default: Boolean(option.default)
    });

    session.updatedAt = Date.now();

    return true;
}

function editOption(session, menuIndex, optionIndex, changes = {}) {
    const menu = session?.data?.selectMenus?.[menuIndex];

    if (
        !menu ||
        menu.type !== "string" ||
        !menu.options?.[optionIndex]
    ) {
        return false;
    }

    const option = menu.options[optionIndex];

    if (changes.label !== undefined) {
        option.label = String(changes.label).slice(0, 100);
    }

    if (changes.value !== undefined) {
        option.value = String(changes.value).slice(0, 100);
    }

    if (changes.description !== undefined) {
        option.description = String(
            changes.description
        ).slice(0, 100);
    }

    if (changes.emoji !== undefined) {
        option.emoji = changes.emoji;
    }

    if (changes.default !== undefined) {
        option.default = Boolean(changes.default);
    }

    session.updatedAt = Date.now();

    return true;
}

function removeOption(session, menuIndex, optionIndex) {
    const menu = session?.data?.selectMenus?.[menuIndex];

    if (
        !menu ||
        menu.type !== "string" ||
        !menu.options?.[optionIndex]
    ) {
        return false;
    }

    menu.options.splice(optionIndex, 1);

    session.updatedAt = Date.now();

    return true;
}

function moveOption(session, menuIndex, optionIndex, direction) {
    const menu = session?.data?.selectMenus?.[menuIndex];

    if (
        !menu ||
        menu.type !== "string" ||
        !menu.options?.[optionIndex]
    ) {
        return false;
    }

    const newIndex =
        direction === "up"
            ? optionIndex - 1
            : optionIndex + 1;

    if (
        newIndex < 0 ||
        newIndex >= menu.options.length
    ) {
        return false;
    }

    [
        menu.options[optionIndex],
        menu.options[newIndex]
    ] = [
        menu.options[newIndex],
        menu.options[optionIndex]
    ];

    session.updatedAt = Date.now();

    return true;
}

function removeSelectMenu(session, index) {
    if (!session?.data?.selectMenus?.[index]) {
        return false;
    }

    session.data.selectMenus.splice(index, 1);

    if (session.data.selectMenus.length === 0) {
        session.data.activeSelectMenu = null;
    } else if (
        session.data.activeSelectMenu >=
        session.data.selectMenus.length
    ) {
        session.data.activeSelectMenu =
            session.data.selectMenus.length - 1;
    }

    session.updatedAt = Date.now();

    return true;
}

function buildSelectMenuRows(selectMenus = []) {
    return selectMenus
        .map(createSelectMenu)
        .filter(Boolean)
        .map(menu => ({
            type: 1,
            components: [menu.toJSON()]
        }))
        .slice(0, 5);
}

module.exports = {
    SELECT_TYPES,
    SELECT_ACTIONS,

    createSelectMenu,
    createSelectMenus,
    buildSelectMenuRows,

    addSelectMenu,
    editSelectMenu,
    removeSelectMenu,

    addOption,
    editOption,
    removeOption,
    moveOption
};
