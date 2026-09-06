const state = require("./state");

// =========================
// EMBED CREATOR
// =========================

module.exports = {

    name: "embedCreator",

    // =========================
    // START
    // =========================

    async start(client, message, args = []) {
        if (!message?.author || !message?.guild) {
            return;
        }

        const userId = message.author.id;
        const guildId = message.guild.id;

        // Create a fresh temporary session.
        state.create(
            userId,
            guildId
        );

        return state.get(userId);
    },

    // =========================
    // GET
    // =========================

    get(userId) {
        return state.get(userId);
    },

    // =========================
    // UPDATE
    // =========================

    update(userId, changes = {}) {
        return state.update(
            userId,
            changes
        );
    },

    // =========================
    // REMOVE
    // =========================

    remove(userId) {
        return state.remove(
            userId
        );
    },

    // =========================
    // CHECK
    // =========================

    has(userId) {
        return state.has(
            userId
        );
    },

    // =========================
    // SENT MESSAGE
    // =========================

    addSentMessage(userId, message) {
        return state.addSentMessage(
            userId,
            message
        );
    },

    removeSentMessage(userId, messageId) {
        return state.removeSentMessage(
            userId,
            messageId
        );
    }

};
