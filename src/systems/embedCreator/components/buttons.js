const {
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// =========================
// BUTTON STYLES
// =========================

const styles = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    link: ButtonStyle.Link
};

// =========================
// CREATE BUTTON
// =========================

function create(data = {}) {
    const button =
        new ButtonBuilder();

    const style =
        styles[
            String(data.style || "primary")
                .toLowerCase()
        ];

    if (!style) {
        throw new Error(
            "Invalid button style."
        );
    }

    button.setStyle(style);

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

    if (data.disabled === true) {
        button.setDisabled(true);
    }

    if (style === ButtonStyle.Link) {
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
                "Non-link buttons require a custom ID."
            );
        }

        button.setCustomId(
            String(data.customId)
        );
    }

    return button;
}

// =========================
// CREATE DATA
// =========================

function createData({
    label = "",
    style = "primary",
    emoji = "",
    customId = "",
    url = "",
    disabled = false
} = {}) {
    return {
        type: "button",
        label,
        style,
        emoji,
        customId,
        url,
        disabled
    };
}

// =========================
// GET STYLES
// =========================

function getStyles() {
    return {
        ...styles
    };
}

// =========================
// EXPORTS
// =========================

module.exports = {
    create,
    createData,
    getStyles,
    styles
};
