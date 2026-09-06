const sessions = new Map();

// =========================
// CREATE STATE
// =========================

function create(userId, guildId, data = {}) {
    const state = {
        userId,
        guildId,

        name: data.name || null,

        content: data.content || "",

        embed: {
            title: data.embed?.title || "",
            description: data.embed?.description || "",
            color: data.embed?.color || null,
            url: data.embed?.url || "",

            author: {
                name: data.embed?.author?.name || "",
                iconURL: data.embed?.author?.iconURL || "",
                url: data.embed?.author?.url || ""
            },

            footer: {
                text: data.embed?.footer?.text || "",
                iconURL: data.embed?.footer?.iconURL || ""
            },

            thumbnail: data.embed?.thumbnail || "",
            image: data.embed?.image || "",

            fields: Array.isArray(data.embed?.fields)
                ? [...data.embed.fields]
                : []
        },

        components: Array.isArray(data.components)
            ? [...data.components]
            : [],

        messageId: null,
        channelId: null,

        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    sessions.set(userId, state);

    return state;
}

// =========================
// GET STATE
// =========================

function get(userId) {
    return sessions.get(userId) || null;
}

// =========================
// UPDATE STATE
// =========================

function update(userId, changes = {}) {
    const state = sessions.get(userId);

    if (!state) {
        return null;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            changes,
            "content"
        )
    ) {
        state.content = changes.content;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            changes,
            "name"
        )
    ) {
        state.name = changes.name;
    }

    if (changes.embed) {
        Object.assign(
            state.embed,
            changes.embed
        );
    }

    if (
        Object.prototype.hasOwnProperty.call(
            changes,
            "components"
        )
    ) {
        state.components = changes.components;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            changes,
            "messageId"
        )
    ) {
        state.messageId = changes.messageId;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            changes,
            "channelId"
        )
    ) {
        state.channelId = changes.channelId;
    }

    state.updatedAt = Date.now();

    return state;
}

// =========================
// UPDATE EMBED PROPERTY
// =========================

function updateEmbed(userId, property, value) {
    const state = sessions.get(userId);

    if (!state) {
        return null;
    }

    state.embed[property] = value;
    state.updatedAt = Date.now();

    return state;
}

// =========================
// UPDATE NESTED EMBED DATA
// =========================

function updateAuthor(userId, changes = {}) {
    const state = sessions.get(userId);

    if (!state) {
        return null;
    }

    Object.assign(
        state.embed.author,
        changes
    );

    state.updatedAt = Date.now();

    return state;
}

function updateFooter(userId, changes = {}) {
    const state = sessions.get(userId);

    if (!state) {
        return null;
    }

    Object.assign(
        state.embed.footer,
        changes
    );

    state.updatedAt = Date.now();

    return state;
}

// =========================
// REMOVE STATE
// =========================

function remove(userId) {
    return sessions.delete(userId);
}

// =========================
// CHECK STATE
// =========================

function has(userId) {
    return sessions.has(userId);
}

// =========================
// EXPORTS
// =========================

module.exports = {
    create,
    get,
    update,
    updateEmbed,
    updateAuthor,
    updateFooter,
    remove,
    has
};
