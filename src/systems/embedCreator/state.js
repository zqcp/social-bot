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

        sentMessages: Array.isArray(data.sentMessages)
            ? [...data.sentMessages]
            : [],

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
            "sentMessages"
        )
    ) {
        state.sentMessages = changes.sentMessages;
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
// UPDATE AUTHOR
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

// =========================
// UPDATE FOOTER
// =========================

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
// ADD SENT MESSAGE
// =========================

function addSentMessage(
    userId,
    message
) {
    const state = sessions.get(userId);

    if (!state || !message) {
        return null;
    }

    const exists = state.sentMessages.some(
        entry =>
            entry.guildId === message.guildId &&
            entry.channelId === message.channelId &&
            entry.messageId === message.messageId
    );

    if (!exists) {
        state.sentMessages.push({
            guildId: message.guildId,
            channelId: message.channelId,
            messageId: message.messageId
        });
    }

    state.updatedAt = Date.now();

    return state;
}

// =========================
// REMOVE SENT MESSAGE
// =========================

function removeSentMessage(
    userId,
    messageId
) {
    const state = sessions.get(userId);

    if (!state) {
        return null;
    }

    state.sentMessages =
        state.sentMessages.filter(
            entry =>
                entry.messageId !== messageId
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
    addSentMessage,
    removeSentMessage,
    remove,
    has
};
