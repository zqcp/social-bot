// =========================
// SELECT TYPES
// =========================

const types = {
    string: {
        label: "String Select",
        emoji: "📝",
        description:
            "Choose from custom options."
    },

    user: {
        label: "User Select",
        emoji: "👤",
        description:
            "Choose Discord users."
    },

    role: {
        label: "Role Select",
        emoji: "🎭",
        description:
            "Choose Discord roles."
    },

    channel: {
        label: "Channel Select",
        emoji: "📢",
        description:
            "Choose Discord channels."
    },

    mentionable: {
        label: "Mentionable Select",
        emoji: "🔗",
        description:
            "Choose users or roles."
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
// IS STRING
// =========================

function isString(type) {
    return (
        String(type).toLowerCase() ===
        "string"
    );
}

// =========================
// IS USER
// =========================

function isUser(type) {
    return (
        String(type).toLowerCase() ===
        "user"
    );
}

// =========================
// IS ROLE
// =========================

function isRole(type) {
    return (
        String(type).toLowerCase() ===
        "role"
    );
}

// =========================
// IS CHANNEL
// =========================

function isChannel(type) {
    return (
        String(type).toLowerCase() ===
        "channel"
    );
}

// =========================
// IS MENTIONABLE
// =========================

function isMentionable(type) {
    return (
        String(type).toLowerCase() ===
        "mentionable"
    );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    types,
    get,
    has,
    list,
    isString,
    isUser,
    isRole,
    isChannel,
    isMentionable
};
