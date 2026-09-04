const {
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const BUTTON_STYLES = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    link: ButtonStyle.Link
};

const BUTTON_ACTIONS = {
    none: "none",
    addRole: "add_role",
    removeRole: "remove_role"
};

function createButton(data = {}) {
    const style = String(data.style || "secondary").toLowerCase();

    const button = new ButtonBuilder()
        .setStyle(BUTTON_STYLES[style] || ButtonStyle.Secondary)
        .setLabel(data.label || "Button")
        .setDisabled(Boolean(data.disabled));

    if (data.emoji) {
        button.setEmoji(data.emoji);
    }

    if (style === "link") {
        if (data.url) {
            button.setURL(data.url);
        }
    } else {
        button.setCustomId(
            data.customId || `embed_button_${Date.now()}`
        );
    }

    return button;
}

function createButtons(buttons = []) {
    return buttons.map(createButton);
}

function addButton(session, data = {}) {
    if (!Array.isArray(session.data.buttons)) {
        session.data.buttons = [];
    }

    const button = {
        label: data.label || "Button",
        emoji: data.emoji || "",
        style: String(data.style || "secondary").toLowerCase(),
        customId: data.customId || "",
        url: data.url || "",
        disabled: Boolean(data.disabled),

        action: data.action || BUTTON_ACTIONS.none,
        roleId: data.roleId || null
    };

    if (!BUTTON_STYLES[button.style]) {
        button.style = "secondary";
    }

    if (button.action !== BUTTON_ACTIONS.none && !button.roleId) {
        return null;
    }

    if (button.style === "link") {
        button.customId = "";
    } else {
        button.url = "";
    }

    session.data.buttons.push(button);
    session.updatedAt = Date.now();

    return button;
}

function editButton(session, index, changes = {}) {
    if (!session?.data?.buttons?.[index]) {
        return false;
    }

    const button = session.data.buttons[index];

    if (changes.style !== undefined) {
        const style = String(changes.style).toLowerCase();

        if (!BUTTON_STYLES[style]) {
            return false;
        }

        button.style = style;
    }

    if (changes.label !== undefined) {
        button.label = changes.label;
    }

    if (changes.emoji !== undefined) {
        button.emoji = changes.emoji;
    }

    if (changes.customId !== undefined) {
        button.customId = changes.customId;
    }

    if (changes.url !== undefined) {
        button.url = changes.url;
    }

    if (changes.disabled !== undefined) {
        button.disabled = Boolean(changes.disabled);
    }

    if (changes.action !== undefined) {
        if (!BUTTON_ACTIONS[changes.action]) {
            return false;
        }

        button.action = changes.action;
    }

    if (changes.roleId !== undefined) {
        button.roleId = changes.roleId;
    }

    if (button.style === "link") {
        button.customId = "";
    } else {
        button.url = "";
    }

    session.updatedAt = Date.now();

    return true;
}

function removeButton(session, index) {
    if (!session?.data?.buttons?.[index]) {
        return false;
    }

    session.data.buttons.splice(index, 1);
    session.updatedAt = Date.now();

    return true;
}

function moveButton(session, index, direction) {
    if (!session?.data?.buttons?.[index]) {
        return false;
    }

    const newIndex =
        direction === "up"
            ? index - 1
            : index + 1;

    if (
        newIndex < 0 ||
        newIndex >= session.data.buttons.length
    ) {
        return false;
    }

    [
        session.data.buttons[index],
        session.data.buttons[newIndex]
    ] = [
        session.data.buttons[newIndex],
        session.data.buttons[index]
    ];

    session.updatedAt = Date.now();

    return true;
}

function buildButtonRows(buttons = []) {
    const rows = [];

    for (let i = 0; i < buttons.length; i += 5) {
        const chunk = buttons.slice(i, i + 5);

        rows.push({
            type: 1,
            components: createButtons(chunk).map(button =>
                button.toJSON()
            )
        });
    }

    return rows.slice(0, 5);
}

module.exports = {
    BUTTON_STYLES,
    BUTTON_ACTIONS,

    createButton,
    createButtons,
    buildButtonRows,

    addButton,
    editButton,
    removeButton,
    moveButton
};
