const state = require("./state");

// =========================
// CONFIG
// =========================

const SESSION_TIMEOUT = 15 * 60 * 1000;

// =========================
// ACTIVE TIMERS
// =========================

const timers = new Map();

// =========================
// CLEAR TIMER
// =========================

function clearTimer(userId) {
    const timer =
        timers.get(userId);

    if (timer) {
        clearTimeout(timer);
        timers.delete(userId);
    }
}

// =========================
// START TIMEOUT
// =========================

function startTimeout(
    userId,
    onExpire
) {
    clearTimer(userId);

    const timer = setTimeout(
        async () => {
            timers.delete(userId);

            if (!state.has(userId)) {
                return;
            }

            state.remove(userId);

            if (
                typeof onExpire ===
                "function"
            ) {
                try {
                    await onExpire();
                } catch (error) {
                    console.error(
                        "Embed Creator Expiration Error:",
                        error
                    );
                }
            }
        },
        SESSION_TIMEOUT
    );

    timers.set(
        userId,
        timer
    );
}

// =========================
// REFRESH TIMEOUT
// =========================

function refreshTimeout(
    userId,
    onExpire
) {
    if (!state.has(userId)) {
        return false;
    }

    startTimeout(
        userId,
        onExpire
    );

    return true;
}

// =========================
// START
// =========================

async function start(
    client,
    message,
    args = [],
    onExpire
) {
    if (
        !message?.author ||
        !message?.guild
    ) {
        return null;
    }

    const userId =
        message.author.id;

    const guildId =
        message.guild.id;

    // Remove an existing session
    // before creating a new one.
    clearTimer(userId);

    state.create(
        userId,
        guildId
    );

    const session =
        state.get(userId);

    startTimeout(
        userId,
        onExpire
    );

    return session;
}

// =========================
// GET
// =========================

function get(userId) {
    return state.get(
        userId
    );
}

// =========================
// UPDATE
// =========================

function update(
    userId,
    changes = {},
    onExpire
) {
    const updated =
        state.update(
            userId,
            changes
        );

    if (updated) {
        refreshTimeout(
            userId,
            onExpire
        );
    }

    return updated;
}

// =========================
// OWNERSHIP
// =========================

function isOwner(
    userId,
    session
) {
    return (
        session &&
        session.userId === userId
    );
}

// =========================
// REMOVE
// =========================

function remove(userId) {
    clearTimer(userId);

    return state.remove(
        userId
    );
}

// =========================
// HAS
// =========================

function has(userId) {
    return state.has(
        userId
    );
}

// =========================
// ADD SENT MESSAGE
// =========================

function addSentMessage(
    userId,
    message
) {
    return state.addSentMessage(
        userId,
        message
    );
}

// =========================
// REMOVE SENT MESSAGE
// =========================

function removeSentMessage(
    userId,
    messageId
) {
    return state.removeSentMessage(
        userId,
        messageId
    );
}

// =========================
// DESTROY
// =========================

function destroy(userId) {
    clearTimer(userId);

    return state.remove(
        userId
    );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    name: "embedCreator",

    start,

    get,
    update,

    isOwner,
    has,

    remove,
    destroy,

    refreshTimeout,

    addSentMessage,
    removeSentMessage,

    SESSION_TIMEOUT
};
