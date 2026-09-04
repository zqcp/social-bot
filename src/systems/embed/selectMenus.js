// ============================================================
// EMBED SELECT MENUS SYSTEM
// ============================================================

const SELECT_TYPES = {
    string: "string",
    user: "user",
    role: "role",
    mentionable: "mentionable",
    channel: "channel"
};

const SELECT_ACTIONS = {
    none: "none",
    add_role: "add_role",
    remove_role: "remove_role"
};


// ============================================================
// CREATE SELECT MENU
// ============================================================

function createSelectMenu(data = {}) {
    return {
        type: SELECT_TYPES[data.type]
            ? data.type
            : SELECT_TYPES.string,

        customId: data.customId || "",

        placeholder:
            data.placeholder || "",

        minValues:
            Number.isInteger(data.minValues)
                ? data.minValues
                : 1,

        maxValues:
            Number.isInteger(data.maxValues)
                ? data.maxValues
                : 1,

        disabled:
            Boolean(data.disabled),

        options:
            Array.isArray(data.options)
                ? data.options
                : [],

        channelTypes:
            Array.isArray(data.channelTypes)
                ? data.channelTypes
                : [],

        action:
            SELECT_ACTIONS[data.action]
                ? data.action
                : SELECT_ACTIONS.none,

        roleId:
            data.roleId || ""
    };
}


// ============================================================
// ADD
// ============================================================

function addSelectMenu(session, data = {}) {
    if (!session?.data) {
        return null;
    }

    const menu = createSelectMenu(data);

    session.data.selectMenus.push(menu);

    session.data.activeSelectMenu =
        session.data.selectMenus.length - 1;

    session.updatedAt = Date.now();

    return menu;
}


// ============================================================
// EDIT
// ============================================================

function editSelectMenu(
    session,
    index,
    changes = {}
) {
    if (!session?.data?.selectMenus?.[index]) {
        return null;
    }

    const menu =
        session.data.selectMenus[index];

    if (changes.type !== undefined) {
        menu.type =
            SELECT_TYPES[changes.type]
                ? changes.type
                : SELECT_TYPES.string;
    }

    if (changes.customId !== undefined) {
        menu.customId =
            String(changes.customId);
    }

    if (changes.placeholder !== undefined) {
        menu.placeholder =
            String(changes.placeholder);
    }

    if (changes.minValues !== undefined) {
        menu.minValues =
            Math.max(
                0,
                Number(changes.minValues) || 0
            );
    }

    if (changes.maxValues !== undefined) {
        menu.maxValues =
            Math.max(
                menu.minValues,
                Number(changes.maxValues) ||
                menu.minValues
            );
    }

    if (changes.disabled !== undefined) {
        menu.disabled =
            Boolean(changes.disabled);
    }

    if (changes.options !== undefined) {
        menu.options =
            Array.isArray(changes.options)
                ? changes.options
                : [];
    }

    if (changes.channelTypes !== undefined) {
        menu.channelTypes =
            Array.isArray(changes.channelTypes)
                ? changes.channelTypes
                : [];
    }

    if (changes.action !== undefined) {
        menu.action =
            SELECT_ACTIONS[changes.action]
                ? changes.action
                : SELECT_ACTIONS.none;
    }

    if (changes.roleId !== undefined) {
        menu.roleId =
            String(changes.roleId);
    }

    session.data.activeSelectMenu = index;
    session.updatedAt = Date.now();

    return menu;
}


// ============================================================
// REMOVE
// ============================================================

function removeSelectMenu(session, index) {
    if (!session?.data?.selectMenus?.[index]) {
        return null;
    }

    const removed =
        session.data.selectMenus.splice(index, 1)[0];

    if (!session.data.selectMenus.length) {
        session.data.activeSelectMenu = 0;
    } else {
        session.data.activeSelectMenu =
            Math.min(
                index,
                session.data.selectMenus.length - 1
            );
    }

    session.updatedAt = Date.now();

    return removed;
}


// ============================================================
// MOVE
// ============================================================

function moveSelectMenu(
    session,
    from,
    to
) {
    if (!session?.data?.selectMenus?.length) {
        return false;
    }

    from = Number(from);
    to = Number(to);

    if (
        !Number.isInteger(from) ||
        !Number.isInteger(to) ||
        from < 0 ||
        from >= session.data.selectMenus.length ||
        to < 0 ||
        to >= session.data.selectMenus.length
    ) {
        return false;
    }

    if (from === to) {
        return true;
    }

    const [menu] =
        session.data.selectMenus.splice(
            from,
            1
        );

    session.data.selectMenus.splice(
        to,
        0,
        menu
    );

    session.data.activeSelectMenu = to;
    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// OPTIONS
// ============================================================

function addOption(
    session,
    menuIndex,
    option = {}
) {
    const menu =
        session?.data?.selectMenus?.[menuIndex];

    if (!menu) {
        return null;
    }

    if (menu.type !== SELECT_TYPES.string) {
        return null;
    }

    if (menu.options.length >= 25) {
        return null;
    }

    const newOption = {
        label: option.label || "",
        value: option.value || "",
        description: option.description || "",
        emoji: option.emoji || "",
        default: Boolean(option.default)
    };

    menu.options.push(newOption);

    session.data.activeSelectMenu =
        menuIndex;

    session.updatedAt = Date.now();

    return newOption;
}


function editOption(
    session,
    menuIndex,
    optionIndex,
    changes = {}
) {
    const menu =
        session?.data?.selectMenus?.[menuIndex];

    if (!menu?.options?.[optionIndex]) {
        return null;
    }

    const option =
        menu.options[optionIndex];

    if (changes.label !== undefined) {
        option.label =
            String(changes.label);
    }

    if (changes.value !== undefined) {
        option.value =
            String(changes.value);
    }

    if (changes.description !== undefined) {
        option.description =
            String(changes.description);
    }

    if (changes.emoji !== undefined) {
        option.emoji =
            String(changes.emoji);
    }

    if (changes.default !== undefined) {
        option.default =
            Boolean(changes.default);
    }

    session.updatedAt = Date.now();

    return option;
}


function removeOption(
    session,
    menuIndex,
    optionIndex
) {
    const menu =
        session?.data?.selectMenus?.[menuIndex];

    if (!menu?.options?.[optionIndex]) {
        return null;
    }

    const removed =
        menu.options.splice(
            optionIndex,
            1
        )[0];

    session.updatedAt = Date.now();

    return removed;
}


function moveOption(
    session,
    menuIndex,
    from,
    to
) {
    const menu =
        session?.data?.selectMenus?.[menuIndex];

    if (!menu?.options?.length) {
        return false;
    }

    from = Number(from);
    to = Number(to);

    if (
        !Number.isInteger(from) ||
        !Number.isInteger(to) ||
        from < 0 ||
        from >= menu.options.length ||
        to < 0 ||
        to >= menu.options.length
    ) {
        return false;
    }

    if (from === to) {
        return true;
    }

    const [option] =
        menu.options.splice(from, 1);

    menu.options.splice(to, 0, option);

    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// GET
// ============================================================

function getSelectMenus(session) {
    return session?.data?.selectMenus || [];
}

function getSelectMenu(session, index) {
    return (
        session?.data?.selectMenus?.[index] ||
        null
    );
}

function getOptions(session, menuIndex) {
    return (
        session?.data?.selectMenus?.[menuIndex]
            ?.options || []
    );
}


// ============================================================
// ACTIVE MENU
// ============================================================

function setActiveSelectMenu(
    session,
    index
) {
    if (!session?.data?.selectMenus?.[index]) {
        return false;
    }

    session.data.activeSelectMenu =
        Number(index);

    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// VALIDATE
// ============================================================

function validateSelectMenu(menu) {
    if (!menu) {
        return false;
    }

    if (
        !SELECT_TYPES[menu.type]
    ) {
        return false;
    }

    if (
        menu.minValues < 0 ||
        menu.maxValues < menu.minValues
    ) {
        return false;
    }

    if (
        menu.action !== SELECT_ACTIONS.none &&
        !menu.roleId
    ) {
        return false;
    }

    if (
        menu.type === SELECT_TYPES.string &&
        menu.options.length > 25
    ) {
        return false;
    }

    return true;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    SELECT_TYPES,
    SELECT_ACTIONS,

    createSelectMenu,

    addSelectMenu,
    editSelectMenu,
    removeSelectMenu,
    moveSelectMenu,

    addOption,
    editOption,
    removeOption,
    moveOption,

    getSelectMenus,
    getSelectMenu,
    getOptions,

    setActiveSelectMenu,

    validateSelectMenu
};
