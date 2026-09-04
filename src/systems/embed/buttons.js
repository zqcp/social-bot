// ============================================================
// EMBED BUTTONS SYSTEM
// ============================================================

const BUTTON_STYLES = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    danger: "danger",
    link: "link"
};

const BUTTON_ACTIONS = {
    none: "none",
    add_role: "add_role",
    remove_role: "remove_role"
};


// ============================================================
// CREATE
// ============================================================

function createButton(data = {}) {
    return {
        label: data.label || "",
        emoji: data.emoji || "",
        style: data.style || BUTTON_STYLES.secondary,
        customId: data.customId || "",
        url: data.url || "",
        disabled: Boolean(data.disabled),
        action: data.action || BUTTON_ACTIONS.none,
        roleId: data.roleId || ""
    };
}


// ============================================================
// ADD
// ============================================================

function addButton(session, data = {}) {
    if (!session?.data) {
        return null;
    }

    const button = createButton(data);

    session.data.buttons.push(button);

    session.data.activeButton =
        session.data.buttons.length - 1;

    session.updatedAt = Date.now();

    return button;
}


// ============================================================
// EDIT
// ============================================================

function editButton(session, index, changes = {}) {
    if (!session?.data?.buttons?.[index]) {
        return null;
    }

    const button =
        session.data.buttons[index];

    if (changes.label !== undefined) {
        button.label = String(changes.label);
    }

    if (changes.emoji !== undefined) {
        button.emoji = String(changes.emoji);
    }

    if (changes.style !== undefined) {
        button.style =
            BUTTON_STYLES[changes.style]
                ? changes.style
                : BUTTON_STYLES.secondary;
    }

    if (changes.customId !== undefined) {
        button.customId =
            String(changes.customId);
    }

    if (changes.url !== undefined) {
        button.url =
            String(changes.url);
    }

    if (changes.disabled !== undefined) {
        button.disabled =
            Boolean(changes.disabled);
    }

    if (changes.action !== undefined) {
        button.action =
            BUTTON_ACTIONS[changes.action]
                ? changes.action
                : BUTTON_ACTIONS.none;
    }

    if (changes.roleId !== undefined) {
        button.roleId =
            String(changes.roleId);
    }

    session.data.activeButton = index;
    session.updatedAt = Date.now();

    return button;
}


// ============================================================
// REMOVE
// ============================================================

function removeButton(session, index) {
    if (!session?.data?.buttons?.[index]) {
        return null;
    }

    const removed =
        session.data.buttons.splice(index, 1)[0];

    if (!session.data.buttons.length) {
        session.data.activeButton = 0;
    } else {
        session.data.activeButton =
            Math.min(
                index,
                session.data.buttons.length - 1
            );
    }

    session.updatedAt = Date.now();

    return removed;
}


// ============================================================
// MOVE
// ============================================================

function moveButton(session, from, to) {
    if (!session?.data?.buttons?.length) {
        return false;
    }

    from = Number(from);
    to = Number(to);

    if (
        !Number.isInteger(from) ||
        !Number.isInteger(to) ||
        from < 0 ||
        from >= session.data.buttons.length ||
        to < 0 ||
        to >= session.data.buttons.length
    ) {
        return false;
    }

    if (from === to) {
        return true;
    }

    const [button] =
        session.data.buttons.splice(from, 1);

    session.data.buttons.splice(
        to,
        0,
        button
    );

    session.data.activeButton = to;
    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// GET
// ============================================================

function getButtons(session) {
    return session?.data?.buttons || [];
}

function getButton(session, index) {
    return session?.data?.buttons?.[index] || null;
}


// ============================================================
// ACTIVE BUTTON
// ============================================================

function setActiveButton(session, index) {
    if (!session?.data?.buttons?.[index]) {
        return false;
    }

    session.data.activeButton = Number(index);
    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// VALIDATE
// ============================================================

function validateButton(button) {
    if (!button) {
        return false;
    }

    if (!button.label && button.style !== "link") {
        return false;
    }

    if (button.style === "link" && !button.url) {
        return false;
    }

    if (
        button.action !== BUTTON_ACTIONS.none &&
        !button.roleId
    ) {
        return false;
    }

    return true;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    BUTTON_STYLES,
    BUTTON_ACTIONS,

    createButton,

    addButton,
    editButton,
    removeButton,
    moveButton,

    getButtons,
    getButton,

    setActiveButton,

    validateButton
};
