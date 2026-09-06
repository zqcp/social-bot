const {
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// =========================
// BUTTON TYPES
// =========================

const types = {
    primary: {
        label: "Primary",
        emoji: "🔵",
        style: ButtonStyle.Primary
    },

    secondary: {
        label: "Secondary",
        emoji: "⚪",
        style: ButtonStyle.Secondary
    },

    success: {
        label: "Success",
        emoji: "🟢",
        style: ButtonStyle.Success
    },

    danger: {
        label: "Danger",
        emoji: "🔴",
        style: ButtonStyle.Danger
    },

    link: {
        label: "Link",
        emoji: "🔗",
        style: ButtonStyle.Link
    }
};

// =========================
// GET
// =========================

function get(type) {
    if (!type) {
        return null;
    }

    return types[
        String(type).toLowerCase()
    ] || null;
}

// =========================
// CHECK
// =========================

function has(type) {
    return Boolean(
        get(type)
    );
}

// =========================
// LIST
// =========================

function list() {
    return Object.keys(types);
}

// =========================
// CREATE
// =========================

function create(
    type,
    data = {}
) {
    const buttonType =
        get(type);

    if (!buttonType) {
        throw new Error(
            "Invalid button type."
        );
    }

    const button =
        new ButtonBuilder()
            .setStyle(
                buttonType.style
            );

    if (data.label) {
        button.setLabel(
            String(data.label)
        );
    }

    if (data.emoji) {
        button.setEmoji(
            String(data.emoji)
        );
    }

    if (
        String(type).toLowerCase() ===
        "link"
    ) {
        if (!data.url) {
            throw new Error(
                "Link buttons require a URL."
            );
        }

        button.setURL(
            String(data.url)
        );
    } else {
        if (!data.customId) {
            throw new Error(
                "This button requires a custom ID."
            );
        }

        button.setCustomId(
            String(data.customId)
        );
    }

    return button;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    types,
    get,
    has,
    list,
    create
};
